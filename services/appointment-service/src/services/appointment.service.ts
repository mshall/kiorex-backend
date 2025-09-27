import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
  Inject,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, LessThan, MoreThan, In, Not, IsNull } from 'typeorm';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { ClientProxy, ClientKafka } from '@nestjs/microservices';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';

import { Appointment, AppointmentStatus } from '../entities/appointment.entity';
import { AppointmentSlot, SlotStatus } from '../entities/appointment-slot.entity';
import { CreateAppointmentDto } from '../dto/create-appointment.dto';
import { UpdateAppointmentDto } from '../dto/update-appointment.dto';
import { RescheduleAppointmentDto } from '../dto/reschedule-appointment.dto';
import { ConflictResolver } from './conflict-resolver.service';
import { SlotService } from './slot.service';

@Injectable()
export class AppointmentService {
  constructor(
    @InjectRepository(Appointment)
    private appointmentRepository: Repository<Appointment>,
    @InjectRepository(AppointmentSlot)
    private slotRepository: Repository<AppointmentSlot>,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    @Inject('KAFKA_SERVICE') private kafkaClient: ClientKafka,
    @Inject('USER_SERVICE') private userService: ClientProxy,
    @Inject('NOTIFICATION_SERVICE') private notificationService: ClientProxy,
    @InjectQueue('appointment-queue') private appointmentQueue: Queue,
    @InjectQueue('reminder-queue') private reminderQueue: Queue,
    private conflictResolver: ConflictResolver,
    private slotService: SlotService,
  ) {}

  async createAppointment(
    createDto: CreateAppointmentDto,
    userId: string,
  ): Promise<Appointment> {
    // Validate slot availability
    const slot = await this.slotRepository.findOne({
      where: { id: createDto.slotId },
    });

    if (!slot) {
      throw new NotFoundException('Slot not found');
    }

    if (slot.status !== SlotStatus.AVAILABLE) {
      throw new ConflictException('Slot is not available');
    }

    // Check for conflicts
    const hasConflict = await this.conflictResolver.checkConflict(
      createDto.patientId,
      slot.startTime,
      slot.endTime,
    );

    if (hasConflict) {
      throw new ConflictException('You already have an appointment at this time');
    }

    // Check slot capacity for group sessions
    if (slot.currentBookings >= slot.maxBookings) {
      throw new ConflictException('Slot is fully booked');
    }

    // Begin transaction
    const queryRunner = this.appointmentRepository.manager.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Create appointment
      const appointment = this.appointmentRepository.create({
        ...createDto,
        slot,
        startTime: slot.startTime,
        endTime: slot.endTime,
        status: AppointmentStatus.SCHEDULED,
      });

      const savedAppointment = await queryRunner.manager.save(appointment);

      // Update slot
      slot.currentBookings += 1;
      if (slot.currentBookings >= slot.maxBookings) {
        slot.status = SlotStatus.BOOKED;
      }
      await queryRunner.manager.save(slot);

      // Commit transaction
      await queryRunner.commitTransaction();

      // Queue tasks
      await this.queuePostBookingTasks(savedAppointment);

      // Emit event
      await this.kafkaClient.emit('appointment.created', {
        appointmentId: savedAppointment.id,
        patientId: savedAppointment.patientId,
        providerId: savedAppointment.providerId,
        startTime: savedAppointment.startTime,
        timestamp: new Date(),
      });

      // Clear cache
      await this.clearAppointmentCache(savedAppointment);

      return savedAppointment;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async findAllAppointments(filters: any): Promise<{
    data: Appointment[];
    total: number;
    page: number;
    limit: number;
  }> {
    const {
      patientId,
      providerId,
      status,
      startDate,
      endDate,
      page = 1,
      limit = 20,
    } = filters;

    const query = this.appointmentRepository.createQueryBuilder('appointment')
      .leftJoinAndSelect('appointment.slot', 'slot')
      .leftJoinAndSelect('appointment.appointmentType', 'type');

    if (patientId) {
      query.andWhere('appointment.patientId = :patientId', { patientId });
    }

    if (providerId) {
      query.andWhere('appointment.providerId = :providerId', { providerId });
    }

    if (status) {
      query.andWhere('appointment.status = :status', { status });
    }

    if (startDate && endDate) {
      query.andWhere('appointment.startTime BETWEEN :startDate AND :endDate', {
        startDate,
        endDate,
      });
    }

    query
      .orderBy('appointment.startTime', 'ASC')
      .skip((page - 1) * limit)
      .take(limit);

    const [data, total] = await query.getManyAndCount();

    return { data, total, page, limit };
  }

  async getAppointmentById(id: string): Promise<Appointment> {
    const appointment = await this.appointmentRepository.findOne({
      where: { id },
      relations: ['slot', 'appointmentType', 'reminders'],
    });

    if (!appointment) {
      throw new NotFoundException('Appointment not found');
    }

    return appointment;
  }

  async updateAppointment(
    id: string,
    updateDto: UpdateAppointmentDto,
  ): Promise<Appointment> {
    const appointment = await this.getAppointmentById(id);

    // Validate status transitions
    this.validateStatusTransition(appointment.status, updateDto.status);

    Object.assign(appointment, updateDto);
    const updatedAppointment = await this.appointmentRepository.save(appointment);

    // Handle status-specific actions
    await this.handleStatusChange(updatedAppointment, updateDto.status);

    // Emit event
    await this.kafkaClient.emit('appointment.updated', {
      appointmentId: updatedAppointment.id,
      changes: updateDto,
      timestamp: new Date(),
    });

    // Clear cache
    await this.clearAppointmentCache(updatedAppointment);

    return updatedAppointment;
  }

  async rescheduleAppointment(
    id: string,
    rescheduleDto: RescheduleAppointmentDto,
  ): Promise<Appointment> {
    const appointment = await this.getAppointmentById(id);

    if (appointment.status !== AppointmentStatus.SCHEDULED) {
      throw new BadRequestException('Only scheduled appointments can be rescheduled');
    }

    // Check new slot availability
    const newSlot = await this.slotRepository.findOne({
      where: { id: rescheduleDto.newSlotId },
    });

    if (!newSlot || newSlot.status !== SlotStatus.AVAILABLE) {
      throw new BadRequestException('New slot is not available');
    }

    // Check for conflicts
    const hasConflict = await this.conflictResolver.checkConflict(
      appointment.patientId,
      newSlot.startTime,
      newSlot.endTime,
      appointment.id,
    );

    if (hasConflict) {
      throw new ConflictException('Conflict with another appointment');
    }

    // Begin transaction
    const queryRunner = this.appointmentRepository.manager.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Release old slot
      const oldSlot = appointment.slot;
      oldSlot.currentBookings -= 1;
      if (oldSlot.status === SlotStatus.BOOKED) {
        oldSlot.status = SlotStatus.AVAILABLE;
      }
      await queryRunner.manager.save(oldSlot);

      // Create new appointment
      const newAppointment = this.appointmentRepository.create({
        ...appointment,
        id: undefined,
        slot: newSlot,
        startTime: newSlot.startTime,
        endTime: newSlot.endTime,
        previousAppointmentId: appointment.id,
        createdAt: undefined,
        updatedAt: undefined,
      });

      const savedNewAppointment = await queryRunner.manager.save(newAppointment);

      // Update old appointment
      appointment.status = AppointmentStatus.RESCHEDULED;
      appointment.rescheduledTo = savedNewAppointment.id;
      await queryRunner.manager.save(appointment);

      // Update new slot
      newSlot.currentBookings += 1;
      if (newSlot.currentBookings >= newSlot.maxBookings) {
        newSlot.status = SlotStatus.BOOKED;
      }
      await queryRunner.manager.save(newSlot);

      // Commit transaction
      await queryRunner.commitTransaction();

      // Queue notifications
      await this.appointmentQueue.add('send-reschedule-notification', {
        oldAppointmentId: appointment.id,
        newAppointmentId: savedNewAppointment.id,
        reason: rescheduleDto.reason,
      });

      // Update reminders
      await this.updateReminders(savedNewAppointment);

      // Emit event
      await this.kafkaClient.emit('appointment.rescheduled', {
        oldAppointmentId: appointment.id,
        newAppointmentId: savedNewAppointment.id,
        timestamp: new Date(),
      });

      return savedNewAppointment;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async cancelAppointment(
    id: string,
    userId: string,
    reason: string,
  ): Promise<Appointment> {
    const appointment = await this.getAppointmentById(id);

    if (appointment.status === AppointmentStatus.CANCELLED) {
      throw new BadRequestException('Appointment is already cancelled');
    }

    if (appointment.status === AppointmentStatus.COMPLETED) {
      throw new BadRequestException('Cannot cancel completed appointment');
    }

    // Check cancellation policy
    await this.validateCancellationPolicy(appointment);

    // Begin transaction
    const queryRunner = this.appointmentRepository.manager.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Update appointment
      appointment.status = AppointmentStatus.CANCELLED;
      appointment.cancelledBy = userId;
      appointment.cancellationReason = reason;
      appointment.cancelledAt = new Date();
      
      const cancelledAppointment = await queryRunner.manager.save(appointment);

      // Release slot
      const slot = appointment.slot;
      slot.currentBookings = Math.max(0, slot.currentBookings - 1);
      if (slot.status === SlotStatus.BOOKED) {
        slot.status = SlotStatus.AVAILABLE;
      }
      await queryRunner.manager.save(slot);

      // Commit transaction
      await queryRunner.commitTransaction();

      // Queue notifications
      await this.appointmentQueue.add('send-cancellation-notification', {
        appointmentId: cancelledAppointment.id,
        cancelledBy: userId,
        reason,
      });

      // Process waitlist
      await this.appointmentQueue.add('process-waitlist', {
        providerId: appointment.providerId,
        slotId: slot.id,
        startTime: slot.startTime,
      });

      // Handle refund if applicable
      if (appointment.isPaid) {
        await this.appointmentQueue.add('process-refund', {
          appointmentId: appointment.id,
          paymentId: appointment.paymentId,
        });
      }

      // Emit event
      await this.kafkaClient.emit('appointment.cancelled', {
        appointmentId: cancelledAppointment.id,
        cancelledBy: userId,
        reason,
        timestamp: new Date(),
      });

      return cancelledAppointment;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async checkIn(appointmentId: string): Promise<Appointment> {
    const appointment = await this.getAppointmentById(appointmentId);

    if (appointment.status !== AppointmentStatus.SCHEDULED &&
        appointment.status !== AppointmentStatus.CONFIRMED) {
      throw new BadRequestException('Cannot check in for this appointment');
    }

    // Validate check-in time (e.g., within 30 minutes of appointment)
    const now = new Date();
    const appointmentTime = new Date(appointment.startTime);
    const timeDiff = (appointmentTime.getTime() - now.getTime()) / (1000 * 60); // minutes

    if (timeDiff > 30) {
      throw new BadRequestException('Too early to check in. Please check in within 30 minutes of your appointment.');
    }

    if (timeDiff < -15) {
      throw new BadRequestException('Too late to check in. Please contact the provider.');
    }

    appointment.checkInTime = now;
    appointment.status = AppointmentStatus.CONFIRMED;
    
    const checkedInAppointment = await this.appointmentRepository.save(appointment);

    // Notify provider
    await this.notificationService
      .send('notify', {
        userId: appointment.providerId,
        type: 'patient_checked_in',
        data: {
          appointmentId: appointment.id,
          patientId: appointment.patientId,
          checkInTime: now,
        },
      })
      .toPromise();

    // Emit event
    await this.kafkaClient.emit('appointment.checked_in', {
      appointmentId: appointment.id,
      checkInTime: now,
      timestamp: new Date(),
    });

    return checkedInAppointment;
  }

  async startAppointment(appointmentId: string): Promise<Appointment> {
    const appointment = await this.getAppointmentById(appointmentId);

    if (appointment.status !== AppointmentStatus.CONFIRMED) {
      throw new BadRequestException('Patient must check in first');
    }

    appointment.status = AppointmentStatus.IN_PROGRESS;
    appointment.actualStartTime = new Date();

    if (appointment.checkInTime) {
      appointment.waitTime = Math.round(
        (appointment.actualStartTime.getTime() - appointment.checkInTime.getTime()) / (1000 * 60)
      );
    }

    const startedAppointment = await this.appointmentRepository.save(appointment);

    // Generate video room if needed
    if (appointment.consultationType === 'video') {
      const videoRoom = await this.generateVideoRoom(appointment);
      appointment.videoRoomUrl = videoRoom.url;
      appointment.videoRoomId = videoRoom.id;
      await this.appointmentRepository.save(appointment);
    }

    // Emit event
    await this.kafkaClient.emit('appointment.started', {
      appointmentId: appointment.id,
      startTime: appointment.actualStartTime,
      timestamp: new Date(),
    });

    return startedAppointment;
  }

  async completeAppointment(
    appointmentId: string,
    completionData: any,
  ): Promise<Appointment> {
    const appointment = await this.getAppointmentById(appointmentId);

    if (appointment.status !== AppointmentStatus.IN_PROGRESS) {
      throw new BadRequestException('Appointment must be in progress to complete');
    }

    appointment.status = AppointmentStatus.COMPLETED;
    appointment.actualEndTime = new Date();
    appointment.notes = completionData.notes;
    appointment.privateNotes = completionData.privateNotes;
    appointment.followUpRequired = completionData.followUpRequired;
    appointment.vitals = completionData.vitals;

    const completedAppointment = await this.appointmentRepository.save(appointment);

    // Create follow-up appointment if required
    if (completionData.followUpRequired && completionData.followUpDate) {
      await this.appointmentQueue.add('create-follow-up', {
        originalAppointmentId: appointment.id,
        followUpDate: completionData.followUpDate,
        notes: completionData.followUpNotes,
      });
    }

    // Process payment if not already paid
    if (!appointment.isPaid && appointment.consultationFee) {
      await this.appointmentQueue.add('process-payment', {
        appointmentId: appointment.id,
        amount: appointment.consultationFee,
      });
    }

    // Queue post-appointment tasks
    await this.appointmentQueue.add('post-appointment-tasks', {
      appointmentId: appointment.id,
    });

    // Emit event
    await this.kafkaClient.emit('appointment.completed', {
      appointmentId: appointment.id,
      completedAt: appointment.actualEndTime,
      followUpRequired: appointment.followUpRequired,
      timestamp: new Date(),
    });

    return completedAppointment;
  }

  async getUpcomingAppointments(
    userId: string,
    role: 'patient' | 'provider',
  ): Promise<Appointment[]> {
    const cacheKey = `upcoming:${role}:${userId}`;
    const cached = await this.cacheManager.get<Appointment[]>(cacheKey);
    if (cached) {
      return cached;
    }

    const whereClause = role === 'patient' 
      ? { patientId: userId }
      : { providerId: userId };

    const appointments = await this.appointmentRepository.find({
      where: {
        ...whereClause,
        startTime: MoreThan(new Date()),
        status: In([AppointmentStatus.SCHEDULED, AppointmentStatus.CONFIRMED]),
      },
      relations: ['slot', 'appointmentType'],
      order: { startTime: 'ASC' },
      take: 10,
    });

    await this.cacheManager.set(cacheKey, appointments, 300); // 5 minutes
    return appointments;
  }

  async getAppointmentHistory(
    userId: string,
    role: 'patient' | 'provider',
    page: number = 1,
    limit: number = 20,
  ): Promise<any> {
    const whereClause = role === 'patient'
      ? { patientId: userId }
      : { providerId: userId };

    const [appointments, total] = await this.appointmentRepository.findAndCount({
      where: {
        ...whereClause,
        status: AppointmentStatus.COMPLETED,
      },
      relations: ['slot', 'appointmentType'],
      order: { startTime: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });

    return {
      data: appointments,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async getNoShowReport(providerId: string, startDate: Date, endDate: Date): Promise<any> {
    const noShows = await this.appointmentRepository.find({
      where: {
        providerId,
        status: AppointmentStatus.NO_SHOW,
        startTime: Between(startDate, endDate),
      },
    });

    const grouped = noShows.reduce((acc, appointment) => {
      if (!acc[appointment.patientId]) {
        acc[appointment.patientId] = [];
      }
      acc[appointment.patientId].push(appointment);
      return acc;
    }, {});

    return {
      totalNoShows: noShows.length,
      patientBreakdown: Object.entries(grouped).map(([patientId, appointments]: [string, any[]]) => ({
        patientId,
        count: appointments.length,
        appointments: appointments.map(a => ({
          id: a.id,
          date: a.startTime,
        })),
      })),
      period: { startDate, endDate },
    };
  }

  async markAsNoShow(appointmentId: string): Promise<Appointment> {
    const appointment = await this.getAppointmentById(appointmentId);

    if (appointment.status !== AppointmentStatus.SCHEDULED &&
        appointment.status !== AppointmentStatus.CONFIRMED) {
      throw new BadRequestException('Invalid appointment status for no-show');
    }

    const now = new Date();
    if (now < appointment.endTime) {
      throw new BadRequestException('Cannot mark as no-show before appointment end time');
    }

    appointment.status = AppointmentStatus.NO_SHOW;
    const updatedAppointment = await this.appointmentRepository.save(appointment);

    // Queue penalty processing (e.g., charge no-show fee)
    await this.appointmentQueue.add('process-no-show', {
      appointmentId: appointment.id,
      patientId: appointment.patientId,
    });

    // Emit event
    await this.kafkaClient.emit('appointment.no_show', {
      appointmentId: appointment.id,
      patientId: appointment.patientId,
      timestamp: new Date(),
    });

    return updatedAppointment;
  }

  private async queuePostBookingTasks(appointment: Appointment): Promise<void> {
    // Send confirmation
    await this.appointmentQueue.add('send-confirmation', {
      appointmentId: appointment.id,
    });

    // Schedule reminders
    const reminderTimes = [
      { time: 24 * 60, type: '24_hour' }, // 24 hours before
      { time: 2 * 60, type: '2_hour' },    // 2 hours before
      { time: 30, type: '30_min' },        // 30 minutes before
    ];

    for (const reminder of reminderTimes) {
      const reminderTime = new Date(appointment.startTime);
      reminderTime.setMinutes(reminderTime.getMinutes() - reminder.time);

      if (reminderTime > new Date()) {
        await this.reminderQueue.add(
          'send-reminder',
          {
            appointmentId: appointment.id,
            type: reminder.type,
          },
          {
            delay: reminderTime.getTime() - Date.now(),
          },
        );
      }
    }
  }

  private validateStatusTransition(
    currentStatus: AppointmentStatus,
    newStatus: AppointmentStatus,
  ): void {
    const validTransitions = {
      [AppointmentStatus.SCHEDULED]: [
        AppointmentStatus.CONFIRMED,
        AppointmentStatus.CANCELLED,
        AppointmentStatus.RESCHEDULED,
        AppointmentStatus.NO_SHOW,
      ],
      [AppointmentStatus.CONFIRMED]: [
        AppointmentStatus.IN_PROGRESS,
        AppointmentStatus.CANCELLED,
        AppointmentStatus.NO_SHOW,
      ],
      [AppointmentStatus.IN_PROGRESS]: [
        AppointmentStatus.COMPLETED,
      ],
      [AppointmentStatus.COMPLETED]: [],
      [AppointmentStatus.CANCELLED]: [],
      [AppointmentStatus.NO_SHOW]: [],
      [AppointmentStatus.RESCHEDULED]: [],
    };

    if (newStatus && !validTransitions[currentStatus]?.includes(newStatus)) {
      throw new BadRequestException(
        `Cannot transition from ${currentStatus} to ${newStatus}`,
      );
    }
  }

  private async handleStatusChange(
    appointment: Appointment,
    newStatus: AppointmentStatus,
  ): Promise<void> {
    switch (newStatus) {
      case AppointmentStatus.CONFIRMED:
        await this.notificationService
          .send('notify', {
            userId: appointment.providerId,
            type: 'appointment_confirmed',
            data: { appointmentId: appointment.id },
          })
          .toPromise();
        break;

      case AppointmentStatus.COMPLETED:
        await this.appointmentQueue.add('send-follow-up-survey', {
          appointmentId: appointment.id,
        });
        break;
    }
  }

  private async validateCancellationPolicy(appointment: Appointment): Promise<void> {
    const now = new Date();
    const appointmentTime = new Date(appointment.startTime);
    const hoursUntilAppointment = (appointmentTime.getTime() - now.getTime()) / (1000 * 60 * 60);

    // Example policy: Cannot cancel within 24 hours without penalty
    if (hoursUntilAppointment < 24) {
      // This would typically check user's cancellation history, apply fees, etc.
      // For now, just log a warning
      console.warn(`Late cancellation for appointment ${appointment.id}`);
    }
  }

  private async generateVideoRoom(appointment: Appointment): Promise<any> {
    // Integrate with video service (Twilio, Zoom, etc.)
    // This is a placeholder
    return {
      id: `room_${appointment.id}`,
      url: `https://video.platform.com/room/${appointment.id}`,
    };
  }

  private async updateReminders(appointment: Appointment): Promise<void> {
    // Cancel old reminders
    await this.reminderQueue.clean(0, 'wait', { appointmentId: appointment.previousAppointmentId });

    // Schedule new reminders
    await this.queuePostBookingTasks(appointment);
  }

  private async clearAppointmentCache(appointment: Appointment): Promise<void> {
    await this.cacheManager.del(`upcoming:patient:${appointment.patientId}`);
    await this.cacheManager.del(`upcoming:provider:${appointment.providerId}`);
    await this.cacheManager.del(`appointment:${appointment.id}`);
  }
}
