import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';

export enum CareType {
  MEDICATION = 'medication',
  VITALS = 'vitals',
  HYGIENE = 'hygiene',
  MOBILITY = 'mobility',
  NUTRITION = 'nutrition',
  EMOTIONAL = 'emotional',
  EDUCATION = 'education',
  ASSESSMENT = 'assessment',
  PROCEDURE = 'procedure',
  EMERGENCY = 'emergency',
}

export enum CareStatus {
  SCHEDULED = 'scheduled',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
  MISSED = 'missed',
}

export enum Priority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  URGENT = 'urgent',
  CRITICAL = 'critical',
}

@Entity('patient_care')
@Index(['patientId'])
@Index(['nurseId'])
@Index(['careType'])
@Index(['status'])
@Index(['scheduledTime'])
export class PatientCare {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  patientId: string;

  @Column('uuid')
  nurseId: string;

  @Column()
  nurseName: string;

  @Column({ type: 'enum', enum: CareType })
  careType: CareType;

  @Column({ type: 'enum', enum: CareStatus, default: CareStatus.SCHEDULED })
  status: CareStatus;

  @Column({ type: 'enum', enum: Priority, default: Priority.MEDIUM })
  priority: Priority;

  @Column({ type: 'timestamp' })
  scheduledTime: Date;

  @Column({ type: 'timestamp', nullable: true })
  actualStartTime?: Date;

  @Column({ type: 'timestamp', nullable: true })
  actualEndTime?: Date;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'text', nullable: true })
  instructions?: string;

  @Column({ type: 'text', nullable: true })
  notes?: string;

  @Column({ type: 'text', nullable: true })
  outcome?: string;

  @Column({ type: 'jsonb', nullable: true })
  medications?: {
    name: string;
    dosage: string;
    route: string;
    time: string;
    given: boolean;
    givenAt?: Date;
    notes?: string;
  }[];

  @Column({ type: 'jsonb', nullable: true })
  vitals?: {
    temperature?: number;
    bloodPressure?: string;
    heartRate?: number;
    respiratoryRate?: number;
    oxygenSaturation?: number;
    painLevel?: number;
    recordedAt: Date;
  };

  @Column({ type: 'jsonb', nullable: true })
  assessments?: {
    type: string;
    findings: string;
    score?: number;
    notes?: string;
    assessedAt: Date;
  }[];

  @Column({ type: 'jsonb', nullable: true })
  procedures?: {
    name: string;
    description: string;
    completed: boolean;
    completedAt?: Date;
    complications?: string;
    notes?: string;
  }[];

  @Column({ type: 'jsonb', nullable: true })
  education?: {
    topic: string;
    method: string;
    duration: number;
    understood: boolean;
    questions?: string;
    notes?: string;
  };

  @Column({ type: 'jsonb', nullable: true })
  familyCommunication?: {
    contacted: boolean;
    method: string;
    information: string;
    concerns?: string;
    nextContact?: Date;
  };

  @Column({ type: 'jsonb', nullable: true })
  equipment?: {
    name: string;
    status: string;
    maintenance?: string;
    notes?: string;
  }[];

  @Column({ type: 'jsonb', nullable: true })
  safetyChecks?: {
    check: string;
    status: 'pass' | 'fail' | 'n/a';
    notes?: string;
    checkedAt: Date;
  }[];

  @Column({ nullable: true })
  supervisorId?: string;

  @Column({ nullable: true })
  supervisorName?: string;

  @Column({ nullable: true })
  reviewedBy?: string;

  @Column({ nullable: true })
  reviewedAt?: Date;

  @Column({ type: 'text', nullable: true })
  reviewNotes?: string;

  @Column({ type: 'int', nullable: true })
  duration?: number; // in minutes

  @Column({ type: 'boolean', default: false })
  requiresFollowUp: boolean;

  @Column({ type: 'timestamp', nullable: true })
  followUpTime?: Date;

  @Column({ type: 'text', nullable: true })
  followUpNotes?: string;

  @Column({ type: 'boolean', default: false })
  incidentReported: boolean;

  @Column({ type: 'text', nullable: true })
  incidentDescription?: string;

  @Column({ nullable: true })
  incidentSeverity?: 'low' | 'medium' | 'high' | 'critical';

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
