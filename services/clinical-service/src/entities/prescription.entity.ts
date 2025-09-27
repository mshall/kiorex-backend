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

export enum PrescriptionStatus {
  ACTIVE = 'active',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
  EXPIRED = 'expired',
  ON_HOLD = 'on_hold',
}

export enum MedicationRoute {
  ORAL = 'oral',
  TOPICAL = 'topical',
  INJECTION = 'injection',
  INHALATION = 'inhalation',
  RECTAL = 'rectal',
  TRANSDERMAL = 'transdermal',
  SUBLINGUAL = 'sublingual',
}

@Entity('prescriptions')
@Index(['patientId'])
@Index(['providerId'])
@Index(['status'])
@Index(['rxNumber'])
export class Prescription {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  rxNumber: string;

  @Column('uuid')
  patientId: string;

  @Column('uuid')
  providerId: string;

  @ManyToOne(() => MedicalRecord, { nullable: true })
  @JoinColumn()
  medicalRecord: MedicalRecord;

  @Column()
  medicationName: string;

  @Column({ nullable: true })
  genericName: string;

  @Column({ nullable: true })
  ndcCode: string; // National Drug Code

  @Column({ nullable: true })
  rxNormCode: string;

  @Column()
  strength: string;

  @Column()
  dosage: string;

  @Column({
    type: 'enum',
    enum: MedicationRoute,
  })
  route: MedicationRoute;

  @Column()
  frequency: string;

  @Column()
  duration: string;

  @Column({ type: 'int' })
  quantity: number;

  @Column({ type: 'int', default: 0 })
  refills: number;

  @Column({ type: 'int', default: 0 })
  refillsRemaining: number;

  @Column({ default: false })
  substituteAllowed: boolean;

  @Column({ type: 'text' })
  instructions: string;

  @Column({ type: 'text', nullable: true })
  indication: string;

  @Column({
    type: 'enum',
    enum: PrescriptionStatus,
    default: PrescriptionStatus.ACTIVE,
  })
  status: PrescriptionStatus;

  @Column({ type: 'date' })
  prescribedDate: Date;

  @Column({ type: 'date', nullable: true })
  expirationDate: Date;

  @Column({ nullable: true })
  pharmacyId: string;

  @Column({ nullable: true })
  pharmacyName: string;

  @Column({ type: 'timestamp', nullable: true })
  filledAt: Date;

  @Column({ type: 'jsonb', nullable: true })
  interactions: {
    drug: string;
    severity: string;
    description: string;
  }[];

  @Column({ type: 'jsonb', nullable: true })
  sideEffects: string[];

  @Column({ default: false })
  isControlled: boolean;

  @Column({ nullable: true })
  deaSchedule: string;

  @Column({ nullable: true })
  priorAuthRequired: boolean;

  @Column({ nullable: true })
  priorAuthNumber: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
