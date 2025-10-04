import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, LessThan, MoreThan } from 'typeorm';
import { AppointmentSlot, SlotStatus } from '../entities/appointment-slot.entity';
import { CreateSlotDto, BulkCreateSlotsDto } from '../dto/create-slot.dto';
import moment from 'moment';

@Injectable()
export class SlotService {
  constructor(
    @InjectRepository(AppointmentSlot)
    private slotRepository: Repository<AppointmentSlot>,
  ) {}

  async createSlot(createSlotDto: CreateSlotDto): Promise<AppointmentSlot> {
    // Check for overlapping slots
    const overlapping = await this.checkOverlappingSlots(
      createSlotDto.providerId,
      createSlotDto.startTime,
      createSlotDto.endTime,
    );

    if (overlapping) {
      throw new BadRequestException('Slot overlaps with existing slot');
    }

    const slot = this.slotRepository.create(createSlotDto);
    return await this.slotRepository.save(slot);
  }

  async createBulkSlots(bulkCreateDto: BulkCreateSlotsDto): Promise<AppointmentSlot[]> {
    const {
      providerId,
      startDate,
      endDate,
      workingHours,
      slotDuration,
      breakTime,
      excludeDates,
    } = bulkCreateDto;

    const slots: AppointmentSlot[] = [];
    const current = moment(startDate);
    const end = moment(endDate);

    while (current.isSameOrBefore(end)) {
      // Skip excluded dates
      if (excludeDates?.includes(current.format('YYYY-MM-DD'))) {
        current.add(1, 'day');
        continue;
      }

      // Check if it's a working day
      const dayOfWeek = current.format('dddd').toLowerCase();
      const daySchedule = workingHours[dayOfWeek];

      if (daySchedule && !daySchedule.isOff) {
        const daySlots = this.generateDaySlots(
          providerId,
          current.toDate(),
          daySchedule,
          slotDuration,
          breakTime,
        );
        slots.push(...daySlots);
      }

      current.add(1, 'day');
    }

    // Check for conflicts
    for (const slot of slots) {
      const overlapping = await this.checkOverlappingSlots(
        slot.providerId,
        slot.startTime,
        slot.endTime,
      );
      if (overlapping) {
        throw new BadRequestException(
          `Slot conflict on ${moment(slot.startTime).format('YYYY-MM-DD HH:mm')}`,
        );
      }
    }

    return await this.slotRepository.save(slots);
  }

  async getAvailableSlots(
    providerId: string,
    startDate: Date,
    endDate: Date,
    appointmentTypeId?: string,
  ): Promise<AppointmentSlot[]> {
    const query = this.slotRepository.createQueryBuilder('slot')
      .where('slot.providerId = :providerId', { providerId })
      .andWhere('slot.startTime BETWEEN :startDate AND :endDate', { startDate, endDate })
      .andWhere('slot.status = :status', { status: SlotStatus.AVAILABLE })
      .andWhere('slot.startTime > :now', { now: new Date() });

    if (appointmentTypeId) {
      query.andWhere(':typeId = ANY(slot.allowedAppointmentTypes)', { typeId: appointmentTypeId });
    }

    return await query.orderBy('slot.startTime', 'ASC').getMany();
  }

  async blockSlots(
    providerId: string,
    startTime: Date,
    endTime: Date,
    reason?: string,
  ): Promise<AppointmentSlot[]> {
    const slots = await this.slotRepository.find({
      where: {
        providerId,
        startTime: MoreThan(startTime),
        endTime: LessThan(endTime),
        status: SlotStatus.AVAILABLE,
      },
    });

    for (const slot of slots) {
      slot.status = SlotStatus.BLOCKED;
      slot.notes = reason || 'Provider unavailable';
    }

    return await this.slotRepository.save(slots);
  }

  async releaseSlot(slotId: string): Promise<AppointmentSlot> {
    const slot = await this.slotRepository.findOne({ where: { id: slotId } });
    
    if (!slot) {
      throw new BadRequestException('Slot not found');
    }

    if (slot.currentBookings > 0) {
      throw new BadRequestException('Cannot release slot with active bookings');
    }

    slot.status = SlotStatus.AVAILABLE;
    return await this.slotRepository.save(slot);
  }

  async getProviderSchedule(
    providerId: string,
    date: Date,
  ): Promise<any> {
    const startOfDay = moment(date).startOf('day').toDate();
    const endOfDay = moment(date).endOf('day').toDate();

    const slots = await this.slotRepository.find({
      where: {
        providerId,
        startTime: Between(startOfDay, endOfDay),
      },
      order: { startTime: 'ASC' },
    });

    return {
      date,
      slots: slots.map(slot => ({
        id: slot.id,
        startTime: slot.startTime,
        endTime: slot.endTime,
        status: slot.status,
        currentBookings: slot.currentBookings,
        maxBookings: slot.maxBookings,
        available: slot.status === SlotStatus.AVAILABLE && slot.currentBookings < slot.maxBookings,
      })),
      summary: {
        total: slots.length,
        available: slots.filter(s => s.status === SlotStatus.AVAILABLE).length,
        booked: slots.filter(s => s.status === SlotStatus.BOOKED).length,
        blocked: slots.filter(s => s.status === SlotStatus.BLOCKED).length,
      },
    };
  }

  private generateDaySlots(
    providerId: string,
    date: Date,
    schedule: any,
    slotDuration: number,
    breakTime: number,
  ): AppointmentSlot[] {
    const slots: AppointmentSlot[] = [];
    const day = moment(date);

    // Morning session
    if (schedule.morning) {
      const morningSlots = this.generateSessionSlots(
        providerId,
        day,
        schedule.morning.start,
        schedule.morning.end,
        slotDuration,
      );
      slots.push(...morningSlots);
    }

    // Break time
    if (breakTime && schedule.morning && schedule.afternoon) {
      // No slots during break
    }

    // Afternoon session
    if (schedule.afternoon) {
      const afternoonSlots = this.generateSessionSlots(
        providerId,
        day,
        schedule.afternoon.start,
        schedule.afternoon.end,
        slotDuration,
      );
      slots.push(...afternoonSlots);
    }

    return slots;
  }

  private generateSessionSlots(
    providerId: string,
    day: moment.Moment,
    startTime: string,
    endTime: string,
    duration: number,
  ): AppointmentSlot[] {
    const slots: AppointmentSlot[] = [];
    const [startHour, startMinute] = startTime.split(':').map(Number);
    const [endHour, endMinute] = endTime.split(':').map(Number);

    const sessionStart = day.clone().hour(startHour).minute(startMinute);
    const sessionEnd = day.clone().hour(endHour).minute(endMinute);

    let current = sessionStart.clone();
    while (current.isBefore(sessionEnd)) {
      const slot = new AppointmentSlot();
      slot.providerId = providerId;
      slot.startTime = current.toDate();
      slot.endTime = current.clone().add(duration, 'minutes').toDate();
      slot.status = SlotStatus.AVAILABLE;
      slots.push(slot);

      current.add(duration, 'minutes');
    }

    return slots;
  }

  private async checkOverlappingSlots(
    providerId: string,
    startTime: Date,
    endTime: Date,
    excludeSlotId?: string,
  ): Promise<boolean> {
    const query = this.slotRepository.createQueryBuilder('slot')
      .where('slot.providerId = :providerId', { providerId })
      .andWhere('slot.status != :cancelled', { cancelled: SlotStatus.CANCELLED })
      .andWhere(
        '(slot.startTime < :endTime AND slot.endTime > :startTime)',
        { startTime, endTime }
      );

    if (excludeSlotId) {
      query.andWhere('slot.id != :excludeId', { excludeId: excludeSlotId });
    }

    const count = await query.getCount();
    return count > 0;
  }
}
