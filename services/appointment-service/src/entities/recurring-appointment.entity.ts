import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';

export enum RecurringPattern {
  DAILY = 'daily',
  WEEKLY = 'weekly',
  BIWEEKLY = 'biweekly',
  MONTHLY = 'monthly',
  CUSTOM = 'custom',
}

@Entity('recurring_appointments')
@Index(['providerId'])
@Index(['isActive'])
export class RecurringAppointment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  providerId: string;

  @Column('uuid', { nullable: true })
  appointmentTypeId: string;

  @Column({
    type: 'enum',
    enum: RecurringPattern,
  })
  pattern: RecurringPattern;

  @Column({ type: 'jsonb' })
  schedule: {
    daysOfWeek?: number[]; // 0-6 (Sunday-Saturday)
    dayOfMonth?: number; // 1-31
    interval?: number; // Every N days/weeks/months
    customPattern?: string; // Cron-like expression
  };

  @Column({ type: 'timestamp' })
  startDate: Date;

  @Column({ type: 'timestamp', nullable: true })
  endDate: Date;

  @Column({ type: 'time' })
  startTime: string;

  @Column({ type: 'time' })
  endTime: string;

  @Column({ type: 'int', default: 1 })
  maxBookings: number;

  @Column({ default: true })
  isActive: boolean;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @Column({ type: 'jsonb', nullable: true })
  allowedAppointmentTypes: string[];

  @Column({ nullable: true })
  locationId: string;

  @Column({ nullable: true })
  roomNumber: string;

  @Column({ type: 'jsonb', nullable: true })
  metadata: Record<string, any>;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
