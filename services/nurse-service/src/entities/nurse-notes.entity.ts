import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';

export enum NoteType {
  ASSESSMENT = 'assessment',
  CARE_PLAN = 'care_plan',
  PROGRESS = 'progress',
  MEDICATION = 'medication',
  VITALS = 'vitals',
  INCIDENT = 'incident',
  HANDOVER = 'handover',
  EDUCATION = 'education',
  FAMILY = 'family',
  DISCHARGE = 'discharge',
}

export enum NotePriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  URGENT = 'urgent',
}

@Entity('nurse_notes')
@Index(['patientId'])
@Index(['nurseId'])
@Index(['noteType'])
@Index(['priority'])
@Index(['createdAt'])
export class NurseNotes {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  patientId: string;

  @Column('uuid')
  nurseId: string;

  @Column()
  nurseName: string;

  @Column({ type: 'enum', enum: NoteType })
  noteType: NoteType;

  @Column({ type: 'enum', enum: NotePriority, default: NotePriority.MEDIUM })
  priority: NotePriority;

  @Column({ type: 'text' })
  content: string;

  @Column({ type: 'text', nullable: true })
  summary?: string;

  @Column({ type: 'jsonb', nullable: true })
  tags?: string[];

  @Column({ type: 'jsonb', nullable: true })
  attachments?: {
    type: string;
    url: string;
    name: string;
    size: number;
  }[];

  @Column({ type: 'jsonb', nullable: true })
  relatedCare?: {
    careId: string;
    careType: string;
    relationship: string;
  }[];

  @Column({ type: 'jsonb', nullable: true })
  vitalSigns?: {
    temperature?: number;
    bloodPressure?: string;
    heartRate?: number;
    respiratoryRate?: number;
    oxygenSaturation?: number;
    painLevel?: number;
  };

  @Column({ type: 'jsonb', nullable: true })
  medications?: {
    name: string;
    dosage: string;
    route: string;
    time: string;
    response?: string;
  }[];

  @Column({ type: 'jsonb', nullable: true })
  assessments?: {
    type: string;
    findings: string;
    score?: number;
    recommendations?: string;
  }[];

  @Column({ type: 'jsonb', nullable: true })
  interventions?: {
    intervention: string;
    response: string;
    effectiveness: 'effective' | 'partially_effective' | 'ineffective';
    notes?: string;
  }[];

  @Column({ type: 'jsonb', nullable: true })
  patientResponse?: {
    verbal: string;
    nonVerbal: string;
    emotional: string;
    physical: string;
  };

  @Column({ type: 'jsonb', nullable: true })
  familyCommunication?: {
    present: boolean;
    concerns: string;
    questions: string;
    education: string;
  };

  @Column({ type: 'jsonb', nullable: true })
  safetyConcerns?: {
    concern: string;
    severity: 'low' | 'medium' | 'high' | 'critical';
    action: string;
    resolved: boolean;
  }[];

  @Column({ type: 'jsonb', nullable: true })
  carePlanUpdates?: {
    goal: string;
    intervention: string;
    evaluation: string;
    revision?: string;
  }[];

  @Column({ type: 'boolean', default: false })
  requiresFollowUp: boolean;

  @Column({ type: 'timestamp', nullable: true })
  followUpTime?: Date;

  @Column({ type: 'text', nullable: true })
  followUpNotes?: string;

  @Column({ type: 'boolean', default: false })
  requiresSupervisorReview: boolean;

  @Column({ nullable: true })
  supervisorId?: string;

  @Column({ nullable: true })
  supervisorName?: string;

  @Column({ nullable: true })
  reviewedBy?: string;

  @Column({ nullable: true })
  reviewedAt?: Date;

  @Column({ type: 'text', nullable: true })
  reviewComments?: string;

  @Column({ type: 'boolean', default: false })
  isConfidential: boolean;

  @Column({ type: 'boolean', default: false })
  isDraft: boolean;

  @Column({ type: 'timestamp', nullable: true })
  publishedAt?: Date;

  @Column({ type: 'jsonb', nullable: true })
  metadata?: {
    shiftId?: string;
    unit?: string;
    room?: string;
    bed?: string;
    diagnosis?: string;
    allergies?: string[];
  };

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
