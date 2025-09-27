import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThan } from 'typeorm';
import { AppointmentReminder, ReminderStatus, ReminderType } from '../entities/appointment-reminder.entity';
import { Appointment } from '../entities/appointment.entity';

@Injectable()
export class ReminderService {
  constructor(
    @InjectRepository(AppointmentReminder)
    private reminderRepository: Repository<AppointmentReminder>,
    @InjectRepository(Appointment)
    private appointmentRepository: Repository<Appointment>,
  ) {}

  async createReminder(
    appointmentId: string,
    type: ReminderType,
    scheduledFor: Date,
    message: string,
    recipient: any,
  ): Promise<AppointmentReminder> {
    const reminder = this.reminderRepository.create({
      appointmentId,
      type,
      scheduledFor,
      message,
      recipient,
      status: ReminderStatus.PENDING,
    });

    return await this.reminderRepository.save(reminder);
  }

  async getPendingReminders(): Promise<AppointmentReminder[]> {
    return await this.reminderRepository.find({
      where: {
        status: ReminderStatus.PENDING,
        scheduledFor: LessThan(new Date()),
      },
      relations: ['appointment'],
      order: { scheduledFor: 'ASC' },
    });
  }

  async markAsSent(reminderId: string): Promise<AppointmentReminder> {
    const reminder = await this.reminderRepository.findOne({
      where: { id: reminderId },
    });

    if (!reminder) {
      throw new Error('Reminder not found');
    }

    reminder.status = ReminderStatus.SENT;
    reminder.sentAt = new Date();

    return await this.reminderRepository.save(reminder);
  }

  async markAsFailed(reminderId: string, errorMessage: string): Promise<AppointmentReminder> {
    const reminder = await this.reminderRepository.findOne({
      where: { id: reminderId },
    });

    if (!reminder) {
      throw new Error('Reminder not found');
    }

    reminder.status = ReminderStatus.FAILED;
    reminder.errorMessage = errorMessage;
    reminder.retryCount += 1;

    return await this.reminderRepository.save(reminder);
  }

  async cancelReminders(appointmentId: string): Promise<void> {
    await this.reminderRepository.update(
      {
        appointmentId,
        status: ReminderStatus.PENDING,
      },
      {
        status: ReminderStatus.CANCELLED,
      },
    );
  }

  async rescheduleReminders(
    appointmentId: string,
    newStartTime: Date,
  ): Promise<void> {
    // Cancel existing pending reminders
    await this.cancelReminders(appointmentId);

    // Create new reminders for the new time
    const appointment = await this.appointmentRepository.findOne({
      where: { id: appointmentId },
    });

    if (appointment) {
      await this.scheduleAppointmentReminders(appointment);
    }
  }

  async scheduleAppointmentReminders(appointment: Appointment): Promise<void> {
    const reminderTimes = [
      { time: 24 * 60, type: ReminderType.EMAIL }, // 24 hours before
      { time: 2 * 60, type: ReminderType.SMS },    // 2 hours before
      { time: 30, type: ReminderType.PUSH },       // 30 minutes before
    ];

    for (const reminder of reminderTimes) {
      const reminderTime = new Date(appointment.startTime);
      reminderTime.setMinutes(reminderTime.getMinutes() - reminder.time);

      if (reminderTime > new Date()) {
        await this.createReminder(
          appointment.id,
          reminder.type,
          reminderTime,
          this.generateReminderMessage(appointment, reminder.type),
          {
            userId: appointment.patientId,
            email: appointment.patientId, // This would be fetched from user service
            phone: appointment.patientId, // This would be fetched from user service
          },
        );
      }
    }
  }

  private generateReminderMessage(appointment: Appointment, type: ReminderType): string {
    const appointmentTime = new Date(appointment.startTime);
    const timeStr = appointmentTime.toLocaleString();

    switch (type) {
      case ReminderType.EMAIL:
        return `Reminder: You have an appointment scheduled for ${timeStr}. Please arrive 15 minutes early.`;
      case ReminderType.SMS:
        return `Appointment reminder: ${timeStr}. Reply STOP to opt out.`;
      case ReminderType.PUSH:
        return `Your appointment is starting soon at ${timeStr}.`;
      default:
        return `Appointment reminder for ${timeStr}.`;
    }
  }

  async getReminderStats(providerId: string, startDate: Date, endDate: Date): Promise<any> {
    const stats = await this.reminderRepository
      .createQueryBuilder('reminder')
      .leftJoin('reminder.appointment', 'appointment')
      .select('reminder.status', 'status')
      .addSelect('reminder.type', 'type')
      .addSelect('COUNT(*)', 'count')
      .where('appointment.providerId = :providerId', { providerId })
      .andWhere('reminder.scheduledFor BETWEEN :startDate AND :endDate', { startDate, endDate })
      .groupBy('reminder.status, reminder.type')
      .getRawMany();

    return {
      total: stats.reduce((sum, stat) => sum + parseInt(stat.count), 0),
      byStatus: stats.reduce((acc, stat) => {
        if (!acc[stat.status]) acc[stat.status] = 0;
        acc[stat.status] += parseInt(stat.count);
        return acc;
      }, {}),
      byType: stats.reduce((acc, stat) => {
        if (!acc[stat.type]) acc[stat.type] = 0;
        acc[stat.type] += parseInt(stat.count);
        return acc;
      }, {}),
    };
  }
}
