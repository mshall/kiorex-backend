import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
  ManyToOne,
  JoinColumn,
  OneToOne,
} from 'typeorm';
import { LabBooking } from './lab-booking.entity';

export enum ResultStatus {
  PENDING = 'pending',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  ABNORMAL = 'abnormal',
  CRITICAL = 'critical',
}

export enum SeverityLevel {
  NORMAL = 'normal',
  MILD = 'mild',
  MODERATE = 'moderate',
  SEVERE = 'severe',
  CRITICAL = 'critical',
}

@Entity('lab_results')
@Index(['patientId'])
@Index(['bookingId'])
@Index(['status'])
@Index(['testDate'])
export class LabResult {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  bookingId: string;

  @OneToOne(() => LabBooking, (booking) => booking.result)
  @JoinColumn({ name: 'bookingId' })
  booking: LabBooking;

  @Column()
  testId: string;

  @Column()
  patientId: string;

  @Column({ type: 'timestamp' })
  testDate: Date;

  @Column({ type: 'timestamp' })
  resultDate: Date;

  @Column({
    type: 'enum',
    enum: ResultStatus,
  })
  status: ResultStatus;

  @Column({ type: 'jsonb' })
  parameters: {
    name: string;
    value: string;
    unit: string;
    normalRange: string;
    severity: SeverityLevel;
    interpretation?: string;
  }[];

  @Column({ type: 'text', nullable: true })
  summary?: string;

  @Column({ type: 'text', nullable: true })
  recommendations?: string;

  @Column({ nullable: true })
  reviewedBy?: string;

  @Column({ nullable: true })
  pdfUrl?: string;

  @Column({ default: false })
  isAbnormal: boolean;

  @Column({ type: 'text', nullable: true })
  abnormalNotes?: string;

  @Column({ nullable: true })
  uploadedBy?: string; // Lab technician ID

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Virtual properties
  get hasAbnormalValues(): boolean {
    return this.parameters.some(param => param.severity !== SeverityLevel.NORMAL);
  }

  get criticalValues(): any[] {
    return this.parameters.filter(param => param.severity === SeverityLevel.CRITICAL);
  }

  get severeValues(): any[] {
    return this.parameters.filter(param => param.severity === SeverityLevel.SEVERE);
  }

  get isCompleted(): boolean {
    return this.status === ResultStatus.COMPLETED;
  }

  get isCritical(): boolean {
    return this.status === ResultStatus.CRITICAL || this.criticalValues.length > 0;
  }
}
