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
  SCHEDULED = 'scheduled',
  BLOCKED = 'blocked',
  VACATION = 'vacation',
  SICK_LEAVE = 'sick_leave',
  TRAINING = 'training',
}

export enum ScheduleType {
  REGULAR = 'regular',
  OVERTIME = 'overtime',
  ON_CALL = 'on_call',
  FLOAT = 'float',
  PRECEPTOR = 'preceptor',
  CHARGE = 'charge',
}

@Entity('nurse_schedules')
@Index(['nurseId'])
@Index(['scheduleDate'])
@Index(['status'])
@Index(['type'])
export class NurseSchedule {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  nurseId: string;

  @Column()
  nurseName: string;

  @Column({ type: 'date' })
  scheduleDate: Date;

  @Column({ type: 'enum', enum: ScheduleStatus, default: ScheduleStatus.AVAILABLE })
  status: ScheduleStatus;

  @Column({ type: 'enum', enum: ScheduleType, default: ScheduleType.REGULAR })
  type: ScheduleType;

  @Column({ type: 'time', nullable: true })
  startTime?: string;

  @Column({ type: 'time', nullable: true })
  endTime?: string;

  @Column({ nullable: true })
  unit?: string;

  @Column({ nullable: true })
  floor?: string;

  @Column({ nullable: true })
  ward?: string;

  @Column({ type: 'int', nullable: true })
  patientLoad?: number;

  @Column({ type: 'text', nullable: true })
  notes?: string;

  @Column({ type: 'jsonb', nullable: true })
  responsibilities?: {
    role: string;
    description: string;
    priority: 'low' | 'medium' | 'high';
  }[];

  @Column({ type: 'jsonb', nullable: true })
  competencies?: {
    skill: string;
    level: 'beginner' | 'intermediate' | 'advanced' | 'expert';
    verified: boolean;
    verifiedBy?: string;
    verifiedAt?: Date;
  }[];

  @Column({ type: 'jsonb', nullable: true })
  assignments?: {
    patientId: string;
    patientName: string;
    acuity: 'low' | 'medium' | 'high' | 'critical';
    specialNeeds?: string[];
  }[];

  @Column({ type: 'jsonb', nullable: true })
  breaks?: {
    startTime: string;
    endTime: string;
    type: 'meal' | 'rest' | 'personal';
    duration: number;
  }[];

  @Column({ type: 'jsonb', nullable: true })
  training?: {
    type: string;
    description: string;
    duration: number;
    instructor?: string;
    completed: boolean;
  }[];

  @Column({ type: 'jsonb', nullable: true })
  meetings?: {
    title: string;
    time: string;
    duration: number;
    location?: string;
    attendees?: string[];
    mandatory: boolean;
  }[];

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  hours?: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  overtimeHours?: number;

  @Column({ type: 'decimal', precision: 8, scale: 2, nullable: true })
  payRate?: number;

  @Column({ type: 'decimal', precision: 8, scale: 2, nullable: true })
  totalPay?: number;

  @Column({ nullable: true })
  supervisorId?: string;

  @Column({ nullable: true })
  supervisorName?: string;

  @Column({ nullable: true })
  scheduledBy?: string;

  @Column({ nullable: true })
  scheduledAt?: Date;

  @Column({ nullable: true })
  confirmedBy?: string;

  @Column({ nullable: true })
  confirmedAt?: Date;

  @Column({ nullable: true })
  declinedBy?: string;

  @Column({ nullable: true })
  declinedAt?: Date;

  @Column({ type: 'text', nullable: true })
  declineReason?: string;

  @Column({ nullable: true })
  cancelledBy?: string;

  @Column({ nullable: true })
  cancelledAt?: Date;

  @Column({ type: 'text', nullable: true })
  cancellationReason?: string;

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

  @Column({ type: 'boolean', default: false })
  isOnCall: boolean;

  @Column({ type: 'boolean', default: false })
  isFloat: boolean;

  @Column({ type: 'boolean', default: false })
  isCharge: boolean;

  @Column({ type: 'boolean', default: false })
  isPreceptor: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
