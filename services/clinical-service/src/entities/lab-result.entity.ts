import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { MedicalRecord } from './medical-record.entity';

export enum LabResultStatus {
  PENDING = 'pending',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
  ABNORMAL = 'abnormal',
}

export enum LabPriority {
  ROUTINE = 'routine',
  URGENT = 'urgent',
  STAT = 'stat',
}

@Entity('lab_results')
@Index(['patientId'])
@Index(['orderedBy'])
@Index(['status'])
@Index(['testDate'])
export class LabResult {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  patientId: string;

  @Column('uuid')
  orderedBy: string;

  @ManyToOne(() => MedicalRecord, { nullable: true })
  @JoinColumn()
  medicalRecord: MedicalRecord;

  @Column()
  testName: string;

  @Column({ nullable: true })
  loincCode: string; // LOINC code for standardization

  @Column({ nullable: true })
  category: string;

  @Column({ type: 'date' })
  testDate: Date;

  @Column({ type: 'date', nullable: true })
  resultDate: Date;

  @Column({
    type: 'enum',
    enum: LabResultStatus,
    default: LabResultStatus.PENDING,
  })
  status: LabResultStatus;

  @Column({
    type: 'enum',
    enum: LabPriority,
    default: LabPriority.ROUTINE,
  })
  priority: LabPriority;

  @Column({ type: 'jsonb' })
  results: {
    component: string;
    value: string;
    unit: string;
    referenceRange: string;
    flag: string; // H (high), L (low), N (normal), A (abnormal)
    notes?: string;
  }[];

  @Column({ type: 'text', nullable: true })
  interpretation: string;

  @Column({ type: 'text', nullable: true })
  clinicalSignificance: string;

  @Column({ nullable: true })
  performingLab: string;

  @Column({ nullable: true })
  pathologistId: string;

  @Column({ nullable: true })
  specimenType: string;

  @Column({ type: 'timestamp', nullable: true })
  specimenCollectedAt: Date;

  @Column({ type: 'jsonb', nullable: true })
  attachments: {
    type: string;
    url: string;
    name: string;
  }[];

  @Column({ default: false })
  criticalValue: boolean;

  @Column({ type: 'timestamp', nullable: true })
  criticalValueNotifiedAt: Date;

  @Column({ nullable: true })
  criticalValueNotifiedTo: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
