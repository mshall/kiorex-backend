import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';

export enum ShiftType {
  DAY = 'day',
  EVENING = 'evening',
  NIGHT = 'night',
  ROTATING = 'rotating',
}

export enum ShiftStatus {
  SCHEDULED = 'scheduled',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
  NO_SHOW = 'no_show',
}

@Entity('nurse_shifts')
@Index(['nurseId'])
@Index(['shiftDate'])
@Index(['status'])
export class NurseShift {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  nurseId: string;

  @Column()
  nurseName: string;

  @Column({ type: 'date' })
  shiftDate: Date;

  @Column({ type: 'enum', enum: ShiftType })
  type: ShiftType;

  @Column({ type: 'enum', enum: ShiftStatus, default: ShiftStatus.SCHEDULED })
  status: ShiftStatus;

  @Column({ type: 'time' })
  startTime: string;

  @Column({ type: 'time' })
  endTime: string;

  @Column({ type: 'time', nullable: true })
  actualStartTime?: string;

  @Column({ type: 'time', nullable: true })
  actualEndTime?: string;

  @Column({ nullable: true })
  unit?: string;

  @Column({ nullable: true })
  floor?: string;

  @Column({ nullable: true })
  ward?: string;

  @Column({ type: 'int', nullable: true })
  patientCount?: number;

  @Column({ type: 'text', nullable: true })
  notes?: string;

  @Column({ type: 'text', nullable: true })
  handoverNotes?: string;

  @Column({ type: 'jsonb', nullable: true })
  assignedPatients?: string[];

  @Column({ type: 'jsonb', nullable: true })
  tasks?: {
    task: string;
    completed: boolean;
    completedAt?: Date;
    notes?: string;
  }[];

  @Column({ type: 'jsonb', nullable: true })
  medications?: {
    patientId: string;
    medication: string;
    time: string;
    given: boolean;
    givenAt?: Date;
    notes?: string;
  }[];

  @Column({ type: 'jsonb', nullable: true })
  vitals?: {
    patientId: string;
    temperature?: number;
    bloodPressure?: string;
    heartRate?: number;
    respiratoryRate?: number;
    oxygenSaturation?: number;
    recordedAt: Date;
  }[];

  @Column({ type: 'jsonb', nullable: true })
  incidents?: {
    type: string;
    description: string;
    severity: 'low' | 'medium' | 'high' | 'critical';
    reportedAt: Date;
    resolved: boolean;
    resolution?: string;
  }[];

  @Column({ nullable: true })
  supervisorId?: string;

  @Column({ nullable: true })
  supervisorName?: string;

  @Column({ nullable: true })
  breakStartTime?: string;

  @Column({ nullable: true })
  breakEndTime?: string;

  @Column({ type: 'int', nullable: true })
  breakDuration?: number; // in minutes

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  overtimeHours?: number;

  @Column({ type: 'text', nullable: true })
  overtimeReason?: string;

  @Column({ nullable: true })
  cancelledBy?: string;

  @Column({ nullable: true })
  cancelledAt?: Date;

  @Column({ nullable: true })
  cancellationReason?: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
