import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';

export enum ScheduleStatus {
  AVAILABLE = 'available',
  BOOKED = 'booked',
  BLOCKED = 'blocked',
  MAINTENANCE = 'maintenance',
}

@Entity('surgery_schedules')
@Index(['roomId'])
@Index(['surgeonId'])
@Index(['scheduledDate'])
@Index(['status'])
export class SurgerySchedule {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  roomId: string;

  @Column('uuid', { nullable: true })
  surgeonId?: string;

  @Column('uuid', { nullable: true })
  surgeryId?: string;

  @Column({ type: 'timestamp' })
  scheduledDate: Date;

  @Column({ type: 'timestamp' })
  startTime: Date;

  @Column({ type: 'timestamp' })
  endTime: Date;

  @Column({ type: 'enum', enum: ScheduleStatus, default: ScheduleStatus.AVAILABLE })
  status: ScheduleStatus;

  @Column({ type: 'text', nullable: true })
  notes?: string;

  @Column({ nullable: true })
  blockedBy?: string;

  @Column({ nullable: true })
  blockedAt?: Date;

  @Column({ nullable: true })
  blockReason?: string;

  @Column({ nullable: true })
  unblockedBy?: string;

  @Column({ nullable: true })
  unblockedAt?: Date;

  @Column({ type: 'jsonb', nullable: true })
  recurringPattern?: {
    frequency: 'daily' | 'weekly' | 'monthly';
    interval: number;
    daysOfWeek?: number[];
    endDate?: Date;
  };

  @Column({ type: 'jsonb', nullable: true })
  exceptions?: {
    date: Date;
    reason: string;
    action: 'block' | 'unblock' | 'modify';
  }[];

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  cost?: number;

  @Column({ nullable: true })
  createdBy?: string;

  @Column({ nullable: true })
  updatedBy?: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
