import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
  OneToMany,
} from 'typeorm';
import { Appointment } from './appointment.entity';

export enum SlotStatus {
  AVAILABLE = 'available',
  BOOKED = 'booked',
  BLOCKED = 'blocked',
  CANCELLED = 'cancelled',
}

@Entity('appointment_slots')
@Index(['providerId', 'startTime'])
@Index(['status'])
@Index(['startTime', 'endTime'])
export class AppointmentSlot {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  providerId: string;

  @Column({ type: 'timestamp' })
  startTime: Date;

  @Column({ type: 'timestamp' })
  endTime: Date;

  @Column({
    type: 'enum',
    enum: SlotStatus,
    default: SlotStatus.AVAILABLE,
  })
  status: SlotStatus;

  @Column({ nullable: true })
  recurringPatternId: string;

  @Column({ type: 'jsonb', nullable: true })
  allowedAppointmentTypes: string[];

  @Column({ type: 'int', default: 1 })
  maxBookings: number; // For group sessions

  @Column({ type: 'int', default: 0 })
  currentBookings: number;

  @Column({ nullable: true })
  locationId: string;

  @Column({ nullable: true })
  roomNumber: string;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @Column({ default: false })
  isOverbook: boolean; // Allow double booking

  @OneToMany(() => Appointment, (appointment) => appointment.slot)
  appointments: Appointment[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
