import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';

export enum SurgeryStatus {
  SCHEDULED = 'scheduled',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
  POSTPONED = 'postponed',
}

export enum SurgeryType {
  ELECTIVE = 'elective',
  EMERGENCY = 'emergency',
  URGENT = 'urgent',
}

export enum SurgeryCategory {
  CARDIAC = 'cardiac',
  NEUROSURGERY = 'neurosurgery',
  ORTHOPEDIC = 'orthopedic',
  GENERAL = 'general',
  PLASTIC = 'plastic',
  UROLOGY = 'urology',
  GYNECOLOGY = 'gynecology',
  ONCOLOGY = 'oncology',
  PEDIATRIC = 'pediatric',
  TRAUMA = 'trauma',
}

@Entity('surgeries')
@Index(['patientId'])
@Index(['surgeonId'])
@Index(['status'])
@Index(['scheduledDate'])
export class Surgery {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  patientId: string;

  @Column('uuid')
  surgeonId: string;

  @Column('uuid', { nullable: true })
  appointmentId?: string;

  @Column()
  procedureName: string;

  @Column({ type: 'enum', enum: SurgeryType })
  type: SurgeryType;

  @Column({ type: 'enum', enum: SurgeryCategory })
  category: SurgeryCategory;

  @Column({ type: 'enum', enum: SurgeryStatus, default: SurgeryStatus.SCHEDULED })
  status: SurgeryStatus;

  @Column({ type: 'timestamp' })
  scheduledDate: Date;

  @Column({ type: 'timestamp', nullable: true })
  actualStartTime?: Date;

  @Column({ type: 'timestamp', nullable: true })
  actualEndTime?: Date;

  @Column({ type: 'int', nullable: true })
  estimatedDuration?: number; // in minutes

  @Column({ type: 'int', nullable: true })
  actualDuration?: number; // in minutes

  @Column({ nullable: true })
  operatingRoom?: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ type: 'text', nullable: true })
  preoperativeNotes?: string;

  @Column({ type: 'text', nullable: true })
  operativeNotes?: string;

  @Column({ type: 'text', nullable: true })
  postoperativeNotes?: string;

  @Column({ type: 'text', nullable: true })
  complications?: string;

  @Column({ type: 'text', nullable: true })
  anesthesia?: string;

  @Column({ type: 'text', nullable: true })
  bloodLoss?: string;

  @Column({ type: 'text', nullable: true })
  specimens?: string;

  @Column({ type: 'jsonb', nullable: true })
  teamMembers?: {
    surgeon?: string;
    assistantSurgeon?: string;
    anesthesiologist?: string;
    nurse?: string;
    technician?: string;
  };

  @Column({ type: 'jsonb', nullable: true })
  equipment?: string[];

  @Column({ type: 'jsonb', nullable: true })
  medications?: string[];

  @Column({ type: 'jsonb', nullable: true })
  complicationsList?: string[];

  @Column({ type: 'jsonb', nullable: true })
  followUpInstructions?: string[];

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  cost?: number;

  @Column({ nullable: true })
  insuranceCoverage?: string;

  @Column({ nullable: true })
  priorAuthorization?: string;

  @Column({ nullable: true })
  consentForm?: string;

  @Column({ nullable: true })
  preoperativeChecklist?: string;

  @Column({ nullable: true })
  postoperativeChecklist?: string;

  @Column({ nullable: true })
  dischargeInstructions?: string;

  @Column({ nullable: true })
  followUpDate?: Date;

  @Column({ nullable: true })
  cancelledBy?: string;

  @Column({ nullable: true })
  cancelledAt?: Date;

  @Column({ nullable: true })
  cancellationReason?: string;

  @Column({ nullable: true })
  postponedBy?: string;

  @Column({ nullable: true })
  postponedAt?: Date;

  @Column({ nullable: true })
  postponementReason?: string;

  @Column({ nullable: true })
  rescheduledDate?: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
