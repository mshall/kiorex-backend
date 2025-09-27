import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { Injectable, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { ReminderService } from '../services/reminder.service';

@Processor('reminder-queue')
@Injectable()
export class ReminderProcessor {
  constructor(
    @Inject('NOTIFICATION_SERVICE') private notificationService: ClientProxy,
    private reminderService: ReminderService,
  ) {}

  @Process('send-reminder')
  async handleSendReminder(job: Job<{
    appointmentId: string;
    type: string;
  }>) {
    const { appointmentId, type } = job.data;
    
    try {
      console.log(`Sending ${type} reminder for appointment ${appointmentId}`);
      
      // Get appointment details
      // This would typically fetch from database
      const appointment = {
        id: appointmentId,
        patientId: 'patient-id', // Would be fetched from DB
        providerId: 'provider-id', // Would be fetched from DB
        startTime: new Date(), // Would be fetched from DB
      };
      
      // Create reminder record
      const reminder = await this.reminderService.createReminder(
        appointmentId,
        this.getReminderType(type),
        new Date(),
        this.generateReminderMessage(appointment, type),
        {
          userId: appointment.patientId,
          email: appointment.patientId, // Would be fetched from user service
          phone: appointment.patientId, // Would be fetched from user service
        },
      );
      
      // Send notification
      await this.notificationService
        .send('send-reminder', {
          appointmentId,
          type,
          reminderId: reminder.id,
        })
        .toPromise();
      
      // Mark as sent
      await this.reminderService.markAsSent(reminder.id);
      
      console.log(`${type} reminder sent for appointment ${appointmentId}`);
    } catch (error) {
      console.error(`Failed to send ${type} reminder for appointment ${appointmentId}:`, error);
      
      // Mark as failed
      try {
        const reminders = await this.reminderService.getPendingReminders();
        const reminder = reminders.find(r => r.appointmentId === appointmentId);
        if (reminder) {
          await this.reminderService.markAsFailed(reminder.id, error.message);
        }
      } catch (markError) {
        console.error('Failed to mark reminder as failed:', markError);
      }
      
      throw error;
    }
  }

  @Process('send-bulk-reminders')
  async handleSendBulkReminders(job: Job<{
    appointmentIds: string[];
    type: string;
  }>) {
    const { appointmentIds, type } = job.data;
    
    try {
      console.log(`Sending bulk ${type} reminders for ${appointmentIds.length} appointments`);
      
      for (const appointmentId of appointmentIds) {
        try {
          await this.handleSendReminder({
            data: { appointmentId, type },
          } as Job);
        } catch (error) {
          console.error(`Failed to send reminder for appointment ${appointmentId}:`, error);
          // Continue with other appointments
        }
      }
      
      console.log(`Bulk ${type} reminders completed`);
    } catch (error) {
      console.error(`Failed to send bulk reminders:`, error);
      throw error;
    }
  }

  @Process('cancel-reminders')
  async handleCancelReminders(job: Job<{
    appointmentId: string;
  }>) {
    const { appointmentId } = job.data;
    
    try {
      console.log(`Cancelling reminders for appointment ${appointmentId}`);
      
      await this.reminderService.cancelReminders(appointmentId);
      
      console.log(`Reminders cancelled for appointment ${appointmentId}`);
    } catch (error) {
      console.error(`Failed to cancel reminders for appointment ${appointmentId}:`, error);
      throw error;
    }
  }

  @Process('reschedule-reminders')
  async handleRescheduleReminders(job: Job<{
    appointmentId: string;
    newStartTime: Date;
  }>) {
    const { appointmentId, newStartTime } = job.data;
    
    try {
      console.log(`Rescheduling reminders for appointment ${appointmentId} to ${newStartTime}`);
      
      await this.reminderService.rescheduleReminders(appointmentId, newStartTime);
      
      console.log(`Reminders rescheduled for appointment ${appointmentId}`);
    } catch (error) {
      console.error(`Failed to reschedule reminders for appointment ${appointmentId}:`, error);
      throw error;
    }
  }

  private getReminderType(type: string): any {
    const typeMap = {
      '24_hour': 'email',
      '2_hour': 'sms',
      '30_min': 'push',
    };
    
    return typeMap[type] || 'email';
  }

  private generateReminderMessage(appointment: any, type: string): string {
    const appointmentTime = new Date(appointment.startTime);
    const timeStr = appointmentTime.toLocaleString();

    switch (type) {
      case '24_hour':
        return `Reminder: You have an appointment scheduled for ${timeStr}. Please arrive 15 minutes early.`;
      case '2_hour':
        return `Appointment reminder: ${timeStr}. Reply STOP to opt out.`;
      case '30_min':
        return `Your appointment is starting soon at ${timeStr}.`;
      default:
        return `Appointment reminder for ${timeStr}.`;
    }
  }
}
