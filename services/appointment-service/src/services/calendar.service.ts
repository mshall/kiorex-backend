import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, MoreThan, LessThan } from 'typeorm';
import { Appointment, AppointmentStatus } from '../entities/appointment.entity';
import { AppointmentSlot, SlotStatus } from '../entities/appointment-slot.entity';
import moment from 'moment';

@Injectable()
export class CalendarService {
  constructor(
    @InjectRepository(Appointment)
    private appointmentRepository: Repository<Appointment>,
    @InjectRepository(AppointmentSlot)
    private slotRepository: Repository<AppointmentSlot>,
  ) {}

  async getProviderCalendar(
    providerId: string,
    startDate: Date,
    endDate: Date,
  ): Promise<any> {
    const appointments = await this.appointmentRepository.find({
      where: {
        providerId,
        startTime: Between(startDate, endDate),
      },
      relations: ['slot', 'appointmentType'],
      order: { startTime: 'ASC' },
    });

    const slots = await this.slotRepository.find({
      where: {
        providerId,
        startTime: Between(startDate, endDate),
      },
      order: { startTime: 'ASC' },
    });

    return {
      appointments: appointments.map(apt => ({
        id: apt.id,
        patientId: apt.patientId,
        startTime: apt.startTime,
        endTime: apt.endTime,
        status: apt.status,
        consultationType: apt.consultationType,
        reasonForVisit: apt.reasonForVisit,
        appointmentType: apt.appointmentType?.name,
      })),
      slots: slots.map(slot => ({
        id: slot.id,
        startTime: slot.startTime,
        endTime: slot.endTime,
        status: slot.status,
        currentBookings: slot.currentBookings,
        maxBookings: slot.maxBookings,
        available: slot.status === SlotStatus.AVAILABLE && slot.currentBookings < slot.maxBookings,
      })),
    };
  }

  async getPatientCalendar(
    patientId: string,
    startDate: Date,
    endDate: Date,
  ): Promise<any> {
    const appointments = await this.appointmentRepository.find({
      where: {
        patientId,
        startTime: Between(startDate, endDate),
      },
      relations: ['slot', 'appointmentType'],
      order: { startTime: 'ASC' },
    });

    return {
      appointments: appointments.map(apt => ({
        id: apt.id,
        providerId: apt.providerId,
        startTime: apt.startTime,
        endTime: apt.endTime,
        status: apt.status,
        consultationType: apt.consultationType,
        reasonForVisit: apt.reasonForVisit,
        appointmentType: apt.appointmentType?.name,
        location: apt.slot?.roomNumber,
      })),
    };
  }

  async getAvailability(
    providerId: string,
    startDate: Date,
    endDate: Date,
    appointmentTypeId?: string,
  ): Promise<any> {
    const availableSlots = await this.slotRepository.find({
      where: {
        providerId,
        startTime: Between(startDate, endDate),
        status: SlotStatus.AVAILABLE,
      },
      order: { startTime: 'ASC' },
    });

    // Filter by appointment type if specified
    const filteredSlots = appointmentTypeId
      ? availableSlots.filter(slot => 
          !slot.allowedAppointmentTypes || 
          slot.allowedAppointmentTypes.includes(appointmentTypeId)
        )
      : availableSlots;

    // Group by date
    const groupedSlots = filteredSlots.reduce((acc, slot) => {
      const date = moment(slot.startTime).format('YYYY-MM-DD');
      if (!acc[date]) {
        acc[date] = [];
      }
      acc[date].push({
        id: slot.id,
        startTime: slot.startTime,
        endTime: slot.endTime,
        currentBookings: slot.currentBookings,
        maxBookings: slot.maxBookings,
      });
      return acc;
    }, {});

    return {
      availability: Object.entries(groupedSlots).map(([date, slots]) => ({
        date,
        slots: (slots as any[]).sort((a, b) => a.startTime.getTime() - b.startTime.getTime()),
      })),
    };
  }

  async getBusyTimes(
    providerId: string,
    startDate: Date,
    endDate: Date,
  ): Promise<any> {
    const appointments = await this.appointmentRepository.find({
      where: {
        providerId,
        startTime: Between(startDate, endDate),
        status: Between(AppointmentStatus.SCHEDULED, AppointmentStatus.IN_PROGRESS),
      },
      order: { startTime: 'ASC' },
    });

    const blockedSlots = await this.slotRepository.find({
      where: {
        providerId,
        startTime: Between(startDate, endDate),
        status: SlotStatus.BLOCKED,
      },
      order: { startTime: 'ASC' },
    });

    return {
      appointments: appointments.map(apt => ({
        startTime: apt.startTime,
        endTime: apt.endTime,
        type: 'appointment',
        id: apt.id,
      })),
      blocked: blockedSlots.map(slot => ({
        startTime: slot.startTime,
        endTime: slot.endTime,
        type: 'blocked',
        id: slot.id,
        reason: slot.notes,
      })),
    };
  }

  async getMonthlyStats(
    providerId: string,
    year: number,
    month: number,
  ): Promise<any> {
    const startDate = moment([year, month - 1, 1]).startOf('month').toDate();
    const endDate = moment([year, month - 1, 1]).endOf('month').toDate();

    const appointments = await this.appointmentRepository.find({
      where: {
        providerId,
        startTime: Between(startDate, endDate),
      },
    });

    const stats = {
      total: appointments.length,
      scheduled: appointments.filter(a => a.status === 'scheduled').length,
      confirmed: appointments.filter(a => a.status === 'confirmed').length,
      completed: appointments.filter(a => a.status === 'completed').length,
      cancelled: appointments.filter(a => a.status === 'cancelled').length,
      noShow: appointments.filter(a => a.status === 'no_show').length,
      inProgress: appointments.filter(a => a.status === 'in_progress').length,
      rescheduled: appointments.filter(a => a.status === 'rescheduled').length,
    };

    return {
      month,
      year,
      stats,
      dailyBreakdown: this.getDailyBreakdown(appointments, year, month),
    };
  }

  private getDailyBreakdown(appointments: Appointment[], year: number, month: number): any[] {
    const daysInMonth = moment([year, month - 1]).daysInMonth();
    const breakdown = [];

    for (let day = 1; day <= daysInMonth; day++) {
      const date = moment([year, month - 1, day]);
      const dayAppointments = appointments.filter(apt => 
        moment(apt.startTime).isSame(date, 'day')
      );

      breakdown.push({
        date: date.format('YYYY-MM-DD'),
        day,
        total: dayAppointments.length,
        completed: dayAppointments.filter(a => a.status === 'completed').length,
        cancelled: dayAppointments.filter(a => a.status === 'cancelled').length,
        noShow: dayAppointments.filter(a => a.status === 'no_show').length,
      });
    }

    return breakdown;
  }
}
