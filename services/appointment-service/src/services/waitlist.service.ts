import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, MoreThan, LessThan } from 'typeorm';
import { Waitlist, WaitlistStatus } from '../entities/waitlist.entity';
import { CreateWaitlistDto, OfferWaitlistDto } from '../dto/waitlist.dto';
import { AppointmentService } from './appointment.service';
import { SlotService } from './slot.service';

@Injectable()
export class WaitlistService {
  constructor(
    @InjectRepository(Waitlist)
    private waitlistRepository: Repository<Waitlist>,
    private appointmentService: AppointmentService,
    private slotService: SlotService,
  ) {}

  async joinWaitlist(createDto: CreateWaitlistDto): Promise<Waitlist> {
    // Check if already on waitlist for same provider/date
    const existing = await this.waitlistRepository.findOne({
      where: {
        patientId: createDto.patientId,
        providerId: createDto.providerId,
        preferredDate: createDto.preferredDate,
        status: WaitlistStatus.WAITING,
      },
    });

    if (existing) {
      throw new BadRequestException('Already on waitlist for this provider and date');
    }

    const waitlist = this.waitlistRepository.create(createDto);
    return await this.waitlistRepository.save(waitlist);
  }

  async getWaitlistEntries(
    providerId?: string,
    patientId?: string,
    status?: WaitlistStatus,
  ): Promise<Waitlist[]> {
    const where: any = {};

    if (providerId) where.providerId = providerId;
    if (patientId) where.patientId = patientId;
    if (status) where.status = status;

    return await this.waitlistRepository.find({
      where,
      order: { priority: 'DESC', createdAt: 'ASC' },
    });
  }

  async offerSlot(
    waitlistId: string,
    offerDto: OfferWaitlistDto,
  ): Promise<Waitlist> {
    const waitlist = await this.waitlistRepository.findOne({
      where: { id: waitlistId },
    });

    if (!waitlist) {
      throw new NotFoundException('Waitlist entry not found');
    }

    if (waitlist.status !== WaitlistStatus.WAITING) {
      throw new BadRequestException('Waitlist entry is not in waiting status');
    }

    // Set offer expiration (default 2 hours)
    const expiresAt = offerDto.expiresAt || new Date(Date.now() + 2 * 60 * 60 * 1000);

    waitlist.status = WaitlistStatus.OFFERED;
    waitlist.offeredSlotId = offerDto.slotId;
    waitlist.offeredAt = new Date();
    waitlist.offerExpiresAt = expiresAt;
    waitlist.offerCount += 1;

    return await this.waitlistRepository.save(waitlist);
  }

  async acceptOffer(waitlistId: string): Promise<any> {
    const waitlist = await this.waitlistRepository.findOne({
      where: { id: waitlistId },
    });

    if (!waitlist) {
      throw new NotFoundException('Waitlist entry not found');
    }

    if (waitlist.status !== WaitlistStatus.OFFERED) {
      throw new BadRequestException('No active offer for this waitlist entry');
    }

    if (waitlist.offerExpiresAt && new Date() > waitlist.offerExpiresAt) {
      waitlist.status = WaitlistStatus.EXPIRED;
      await this.waitlistRepository.save(waitlist);
      throw new BadRequestException('Offer has expired');
    }

    // Create appointment from the offered slot
    const appointment = await this.appointmentService.createAppointment(
      {
        patientId: waitlist.patientId,
        providerId: waitlist.providerId,
        slotId: waitlist.offeredSlotId,
        appointmentTypeId: waitlist.appointmentTypeId,
      },
      waitlist.patientId,
    );

    // Update waitlist entry
    waitlist.status = WaitlistStatus.ACCEPTED;
    waitlist.acceptedAppointmentId = appointment.id;
    waitlist.respondedAt = new Date();

    await this.waitlistRepository.save(waitlist);

    return appointment;
  }

  async declineOffer(waitlistId: string): Promise<Waitlist> {
    const waitlist = await this.waitlistRepository.findOne({
      where: { id: waitlistId },
    });

    if (!waitlist) {
      throw new NotFoundException('Waitlist entry not found');
    }

    if (waitlist.status !== WaitlistStatus.OFFERED) {
      throw new BadRequestException('No active offer for this waitlist entry');
    }

    waitlist.status = WaitlistStatus.DECLINED;
    waitlist.respondedAt = new Date();

    return await this.waitlistRepository.save(waitlist);
  }

  async processWaitlist(
    providerId: string,
    slotId: string,
    startTime: Date,
  ): Promise<void> {
    // Find the next person on waitlist for this provider
    const nextInLine = await this.waitlistRepository.findOne({
      where: {
        providerId,
        status: WaitlistStatus.WAITING,
        preferredDate: LessThan(new Date(startTime)),
      },
      order: { priority: 'DESC', createdAt: 'ASC' },
    });

    if (nextInLine) {
      // Offer the slot
      await this.offerSlot(nextInLine.id, {
        slotId,
        expiresAt: new Date(Date.now() + 2 * 60 * 60 * 1000), // 2 hours
      });
    }
  }

  async cancelWaitlistEntry(waitlistId: string): Promise<Waitlist> {
    const waitlist = await this.waitlistRepository.findOne({
      where: { id: waitlistId },
    });

    if (!waitlist) {
      throw new NotFoundException('Waitlist entry not found');
    }

    if (waitlist.status === WaitlistStatus.ACCEPTED) {
      throw new BadRequestException('Cannot cancel accepted waitlist entry');
    }

    waitlist.status = WaitlistStatus.CANCELLED;
    return await this.waitlistRepository.save(waitlist);
  }

  async getWaitlistStats(providerId: string): Promise<any> {
    const stats = await this.waitlistRepository
      .createQueryBuilder('waitlist')
      .select('waitlist.status', 'status')
      .addSelect('COUNT(*)', 'count')
      .where('waitlist.providerId = :providerId', { providerId })
      .groupBy('waitlist.status')
      .getRawMany();

    const result = {
      total: 0,
      waiting: 0,
      offered: 0,
      accepted: 0,
      declined: 0,
      expired: 0,
      cancelled: 0,
    };

    stats.forEach(stat => {
      result.total += parseInt(stat.count);
      result[stat.status] = parseInt(stat.count);
    });

    return result;
  }
}
