import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { Injectable, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@Processor('appointment-queue')
@Injectable()
export class AppointmentProcessor {
  constructor(
    @Inject('NOTIFICATION_SERVICE') private notificationService: ClientProxy,
    @Inject('USER_SERVICE') private userService: ClientProxy,
  ) {}

  @Process('send-confirmation')
  async handleSendConfirmation(job: Job<{ appointmentId: string }>) {
    const { appointmentId } = job.data;
    
    try {
      // Get appointment details
      // This would typically fetch from database
      console.log(`Sending confirmation for appointment ${appointmentId}`);
      
      // Send confirmation notification
      await this.notificationService
        .send('send-appointment-confirmation', {
          appointmentId,
          type: 'email',
        })
        .toPromise();
        
      console.log(`Confirmation sent for appointment ${appointmentId}`);
    } catch (error) {
      console.error(`Failed to send confirmation for appointment ${appointmentId}:`, error);
      throw error;
    }
  }

  @Process('send-reschedule-notification')
  async handleSendRescheduleNotification(job: Job<{
    oldAppointmentId: string;
    newAppointmentId: string;
    reason?: string;
  }>) {
    const { oldAppointmentId, newAppointmentId, reason } = job.data;
    
    try {
      console.log(`Sending reschedule notification for appointment ${oldAppointmentId} -> ${newAppointmentId}`);
      
      await this.notificationService
        .send('send-appointment-reschedule', {
          oldAppointmentId,
          newAppointmentId,
          reason,
        })
        .toPromise();
        
      console.log(`Reschedule notification sent for appointment ${oldAppointmentId}`);
    } catch (error) {
      console.error(`Failed to send reschedule notification:`, error);
      throw error;
    }
  }

  @Process('send-cancellation-notification')
  async handleSendCancellationNotification(job: Job<{
    appointmentId: string;
    cancelledBy: string;
    reason: string;
  }>) {
    const { appointmentId, cancelledBy, reason } = job.data;
    
    try {
      console.log(`Sending cancellation notification for appointment ${appointmentId}`);
      
      await this.notificationService
        .send('send-appointment-cancellation', {
          appointmentId,
          cancelledBy,
          reason,
        })
        .toPromise();
        
      console.log(`Cancellation notification sent for appointment ${appointmentId}`);
    } catch (error) {
      console.error(`Failed to send cancellation notification:`, error);
      throw error;
    }
  }

  @Process('process-waitlist')
  async handleProcessWaitlist(job: Job<{
    providerId: string;
    slotId: string;
    startTime: Date;
  }>) {
    const { providerId, slotId, startTime } = job.data;
    
    try {
      console.log(`Processing waitlist for provider ${providerId}, slot ${slotId}`);
      
      // This would typically call the waitlist service
      // await this.waitlistService.processWaitlist(providerId, slotId, startTime);
      
      console.log(`Waitlist processed for provider ${providerId}`);
    } catch (error) {
      console.error(`Failed to process waitlist:`, error);
      throw error;
    }
  }

  @Process('process-refund')
  async handleProcessRefund(job: Job<{
    appointmentId: string;
    paymentId: string;
  }>) {
    const { appointmentId, paymentId } = job.data;
    
    try {
      console.log(`Processing refund for appointment ${appointmentId}, payment ${paymentId}`);
      
      // This would typically integrate with payment service
      // await this.paymentService.processRefund(paymentId);
      
      console.log(`Refund processed for appointment ${appointmentId}`);
    } catch (error) {
      console.error(`Failed to process refund:`, error);
      throw error;
    }
  }

  @Process('process-payment')
  async handleProcessPayment(job: Job<{
    appointmentId: string;
    amount: number;
  }>) {
    const { appointmentId, amount } = job.data;
    
    try {
      console.log(`Processing payment for appointment ${appointmentId}, amount ${amount}`);
      
      // This would typically integrate with payment service
      // await this.paymentService.processPayment(appointmentId, amount);
      
      console.log(`Payment processed for appointment ${appointmentId}`);
    } catch (error) {
      console.error(`Failed to process payment:`, error);
      throw error;
    }
  }

  @Process('create-follow-up')
  async handleCreateFollowUp(job: Job<{
    originalAppointmentId: string;
    followUpDate: Date;
    notes?: string;
  }>) {
    const { originalAppointmentId, followUpDate, notes } = job.data;
    
    try {
      console.log(`Creating follow-up appointment for ${originalAppointmentId} on ${followUpDate}`);
      
      // This would typically create a new appointment
      // await this.appointmentService.createFollowUpAppointment(originalAppointmentId, followUpDate, notes);
      
      console.log(`Follow-up appointment created for ${originalAppointmentId}`);
    } catch (error) {
      console.error(`Failed to create follow-up appointment:`, error);
      throw error;
    }
  }

  @Process('post-appointment-tasks')
  async handlePostAppointmentTasks(job: Job<{
    appointmentId: string;
  }>) {
    const { appointmentId } = job.data;
    
    try {
      console.log(`Running post-appointment tasks for ${appointmentId}`);
      
      // Send follow-up survey
      await this.notificationService
        .send('send-follow-up-survey', {
          appointmentId,
        })
        .toPromise();
      
      // Update patient records
      await this.userService
        .send('update-patient-records', {
          appointmentId,
        })
        .toPromise();
      
      console.log(`Post-appointment tasks completed for ${appointmentId}`);
    } catch (error) {
      console.error(`Failed to run post-appointment tasks:`, error);
      throw error;
    }
  }

  @Process('send-follow-up-survey')
  async handleSendFollowUpSurvey(job: Job<{
    appointmentId: string;
  }>) {
    const { appointmentId } = job.data;
    
    try {
      console.log(`Sending follow-up survey for appointment ${appointmentId}`);
      
      await this.notificationService
        .send('send-follow-up-survey', {
          appointmentId,
        })
        .toPromise();
      
      console.log(`Follow-up survey sent for appointment ${appointmentId}`);
    } catch (error) {
      console.error(`Failed to send follow-up survey:`, error);
      throw error;
    }
  }

  @Process('process-no-show')
  async handleProcessNoShow(job: Job<{
    appointmentId: string;
    patientId: string;
  }>) {
    const { appointmentId, patientId } = job.data;
    
    try {
      console.log(`Processing no-show for appointment ${appointmentId}, patient ${patientId}`);
      
      // Apply no-show penalty (e.g., charge fee)
      // await this.paymentService.chargeNoShowFee(patientId, appointmentId);
      
      // Update patient no-show count
      await this.userService
        .send('update-no-show-count', {
          patientId,
          appointmentId,
        })
        .toPromise();
      
      console.log(`No-show processed for appointment ${appointmentId}`);
    } catch (error) {
      console.error(`Failed to process no-show:`, error);
      throw error;
    }
  }
}
