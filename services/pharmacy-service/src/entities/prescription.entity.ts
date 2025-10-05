import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';

export enum PrescriptionStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  DISPENSED = 'dispensed',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

export enum PrescriptionPriority {
  ROUTINE = 'routine',
  URGENT = 'urgent',
  STAT = 'stat',
}

@Entity('prescriptions')
@Index(['patientId'])
@Index(['providerId'])
@Index(['status'])
@Index(['createdAt'])
export class Prescription {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  patientId: string;

  @Column('uuid')
  providerId: string;

  @Column('uuid', { nullable: true })
  appointmentId?: string;

  @Column('uuid', { nullable: true })
  medicationId?: string;

  @Column()
  medicationName: string;

  @Column({ nullable: true })
  genericName?: string;

  @Column()
  dosage: string; // e.g., '500mg', '10ml'

  @Column()
  frequency: string; // e.g., 'twice daily', 'as needed'

  @Column()
  duration: string; // e.g., '7 days', '1 month'

  @Column({ type: 'int', nullable: true })
  quantity?: number;

  @Column({ nullable: true })
  instructions?: string;

  @Column({ nullable: true })
  clinicalNotes?: string;

  @Column({ type: 'enum', enum: PrescriptionStatus, default: PrescriptionStatus.PENDING })
  status: PrescriptionStatus;

  @Column({ type: 'enum', enum: PrescriptionPriority, default: PrescriptionPriority.ROUTINE })
  priority: PrescriptionPriority;

  @Column({ nullable: true })
  prescribedBy?: string;

  @Column({ nullable: true })
  prescribedAt?: Date;

  @Column({ nullable: true })
  approvedBy?: string;

  @Column({ nullable: true })
  approvedAt?: Date;

  @Column({ nullable: true })
  rejectedBy?: string;

  @Column({ nullable: true })
  rejectedAt?: Date;

  @Column({ nullable: true })
  rejectionReason?: string;

  @Column({ nullable: true })
  dispensedBy?: string;

  @Column({ nullable: true })
  dispensedAt?: Date;

  @Column({ nullable: true })
  completedAt?: Date;

  @Column({ nullable: true })
  cancelledBy?: string;

  @Column({ nullable: true })
  cancelledAt?: Date;

  @Column({ nullable: true })
  cancellationReason?: string;

  @Column({ type: 'jsonb', nullable: true })
  refills?: {
    authorized: number;
    remaining: number;
    lastRefillDate?: Date;
  };

  @Column({ type: 'jsonb', nullable: true })
  drugInteractions?: string[];

  @Column({ type: 'jsonb', nullable: true })
  allergies?: string[];

  @Column({ type: 'jsonb', nullable: true })
  contraindications?: string[];

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  totalCost?: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  patientCost?: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  insuranceCost?: number;

  @Column({ nullable: true })
  insuranceCoverage?: string;

  @Column({ nullable: true })
  priorAuthorization?: string;

  @Column({ type: 'jsonb', nullable: true })
  sideEffects?: string[];

  @Column({ type: 'jsonb', nullable: true })
  monitoring?: string[];

  @Column({ nullable: true })
  followUpDate?: Date;

  @Column({ nullable: true })
  followUpNotes?: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
