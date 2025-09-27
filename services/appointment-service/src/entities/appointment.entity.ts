import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  Index,
  JoinColumn,
} from 'typeorm';
import { AppointmentSlot } from './appointment-slot.entity';
import { AppointmentType } from './appointment-type.entity';
import { AppointmentReminder } from './appointment-reminder.entity';

export enum AppointmentStatus {
  SCHEDULED = 'scheduled',
  CONFIRMED = 'confirmed',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
  NO_SHOW = 'no_show',
  RESCHEDULED = 'rescheduled',
}

export enum ConsultationType {
  IN_PERSON = 'in_person',
  VIDEO = 'video',
  PHONE = 'phone',
}

@Entity('appointments')
@Index(['patientId', 'status'])
@Index(['providerId', 'status'])
@Index(['startTime'])
@Index(['status'])
export class Appointment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  patientId: string;

  @Column('uuid')
  providerId: string;

  @ManyToOne(() => AppointmentSlot)
  @JoinColumn()
  slot: AppointmentSlot;

  @ManyToOne(() => AppointmentType)
  @JoinColumn()
  appointmentType: AppointmentType;

  @Column({
    type: 'enum',
    enum: ConsultationType,
    default: ConsultationType.IN_PERSON,
  })
  consultationType: ConsultationType;

  @Column({
    type: 'enum',
    enum: AppointmentStatus,
    default: AppointmentStatus.SCHEDULED,
  })
  status: AppointmentStatus;

  @Column({ type: 'timestamp' })
  startTime: Date;

  @Column({ type: 'timestamp' })
  endTime: Date;

  @Column({ type: 'text', nullable: true })
  reasonForVisit: string;

  @Column({ type: 'jsonb', nullable: true })
  symptoms: string[];

  @Column({ type: 'text', nullable: true })
  chiefComplaint: string;

  @Column({ type: 'jsonb', nullable: true })
  vitals: {
    bloodPressure?: string;
    heartRate?: number;
    temperature?: number;
    weight?: number;
    height?: number;
  };

  @Column({ type: 'text', nullable: true })
  notes: string;

  @Column({ type: 'text', nullable: true })
  privateNotes: string; // Provider only

  @Column({ nullable: true })
  videoRoomUrl: string;

  @Column({ nullable: true })
  videoRoomId: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  consultationFee: number;

  @Column({ default: false })
  isPaid: boolean;

  @Column({ nullable: true })
  paymentId: string;

  @Column({ nullable: true })
  insuranceClaimId: string;

  @Column({ type: 'timestamp', nullable: true })
  checkInTime: Date;

  @Column({ type: 'timestamp', nullable: true })
  actualStartTime: Date;

  @Column({ type: 'timestamp', nullable: true })
  actualEndTime: Date;

  @Column({ type: 'int', nullable: true })
  waitTime: number; // in minutes

  @Column({ default: false })
  followUpRequired: boolean;

  @Column({ nullable: true })
  followUpAppointmentId: string;

  @Column({ nullable: true })
  previousAppointmentId: string;

  @Column({ nullable: true })
  recurringAppointmentId: string;

  @Column({ type: 'jsonb', nullable: true })
  metadata: Record<string, any>;

  @OneToMany(() => AppointmentReminder, (reminder) => reminder.appointment)
  reminders: AppointmentReminder[];

  @Column({ nullable: true })
  cancelledBy: string;

  @Column({ type: 'text', nullable: true })
  cancellationReason: string;

  @Column({ type: 'timestamp', nullable: true })
  cancelledAt: Date;

  @Column({ nullable: true })
  rescheduledTo: string;

  @Column({ nullable: true })
  rescheduledFrom: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
