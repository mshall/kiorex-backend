import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';

export enum WaitlistStatus {
  WAITING = 'waiting',
  OFFERED = 'offered',
  ACCEPTED = 'accepted',
  DECLINED = 'declined',
  EXPIRED = 'expired',
  CANCELLED = 'cancelled',
}

@Entity('waitlists')
@Index(['patientId'])
@Index(['providerId'])
@Index(['status'])
@Index(['priority'])
export class Waitlist {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  patientId: string;

  @Column('uuid')
  providerId: string;

  @Column('uuid', { nullable: true })
  appointmentTypeId: string;

  @Column({ type: 'date' })
  preferredDate: Date;

  @Column({ type: 'jsonb', nullable: true })
  preferredTimeSlots: {
    start: string;
    end: string;
  }[];

  @Column({
    type: 'enum',
    enum: WaitlistStatus,
    default: WaitlistStatus.WAITING,
  })
  status: WaitlistStatus;

  @Column({ type: 'int', default: 0 })
  priority: number;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @Column({ type: 'timestamp', nullable: true })
  offeredAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  offerExpiresAt: Date;

  @Column({ nullable: true })
  offeredSlotId: string;

  @Column({ nullable: true })
  acceptedAppointmentId: string;

  @Column({ type: 'timestamp', nullable: true })
  respondedAt: Date;

  @Column({ type: 'int', default: 0 })
  offerCount: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
