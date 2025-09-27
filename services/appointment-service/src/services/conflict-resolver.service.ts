import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { Appointment, AppointmentStatus } from '../entities/appointment.entity';

@Injectable()
export class ConflictResolver {
  constructor(
    @InjectRepository(Appointment)
    private appointmentRepository: Repository<Appointment>,
  ) {}

  async checkConflict(
    patientId: string,
    startTime: Date,
    endTime: Date,
    excludeAppointmentId?: string,
  ): Promise<boolean> {
    const query = this.appointmentRepository.createQueryBuilder('appointment')
      .where('appointment.patientId = :patientId', { patientId })
      .andWhere('appointment.status IN (:...statuses)', {
        statuses: [
          AppointmentStatus.SCHEDULED,
          AppointmentStatus.CONFIRMED,
          AppointmentStatus.IN_PROGRESS,
        ],
      })
      .andWhere(
        '(appointment.startTime < :endTime AND appointment.endTime > :startTime)',
        { startTime, endTime }
      );

    if (excludeAppointmentId) {
      query.andWhere('appointment.id != :excludeId', { excludeId: excludeAppointmentId });
    }

    const count = await query.getCount();
    return count > 0;
  }

  async findConflicts(
    patientId: string,
    startTime: Date,
    endTime: Date,
    excludeAppointmentId?: string,
  ): Promise<Appointment[]> {
    const query = this.appointmentRepository.createQueryBuilder('appointment')
      .leftJoinAndSelect('appointment.slot', 'slot')
      .where('appointment.patientId = :patientId', { patientId })
      .andWhere('appointment.status IN (:...statuses)', {
        statuses: [
          AppointmentStatus.SCHEDULED,
          AppointmentStatus.CONFIRMED,
          AppointmentStatus.IN_PROGRESS,
        ],
      })
      .andWhere(
        '(appointment.startTime < :endTime AND appointment.endTime > :startTime)',
        { startTime, endTime }
      );

    if (excludeAppointmentId) {
      query.andWhere('appointment.id != :excludeId', { excludeId: excludeAppointmentId });
    }

    return await query.getMany();
  }

  async suggestAlternativeTimes(
    patientId: string,
    providerId: string,
    preferredStartTime: Date,
    preferredEndTime: Date,
    duration: number = 30,
  ): Promise<Date[]> {
    // This is a simplified implementation
    // In a real system, you'd integrate with the slot service
    // to find available slots around the preferred time
    
    const suggestions: Date[] = [];
    const baseTime = new Date(preferredStartTime);
    
    // Suggest times 30 minutes before and after
    for (let i = -1; i <= 1; i++) {
      const suggestion = new Date(baseTime.getTime() + (i * 30 * 60 * 1000));
      const hasConflict = await this.checkConflict(
        patientId,
        suggestion,
        new Date(suggestion.getTime() + duration * 60 * 1000),
      );
      
      if (!hasConflict) {
        suggestions.push(suggestion);
      }
    }
    
    return suggestions;
  }
}
