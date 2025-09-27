import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  Index,
} from 'typeorm';
import { Prescription } from './prescription.entity';
import { LabResult } from './lab-result.entity';
import { ClinicalNote } from './clinical-note.entity';
import { Vitals } from './vitals.entity';
import { Diagnosis } from './diagnosis.entity';

export enum RecordType {
  CONSULTATION = 'consultation',
  HOSPITALIZATION = 'hospitalization',
  EMERGENCY = 'emergency',
  ROUTINE_CHECKUP = 'routine_checkup',
  FOLLOW_UP = 'follow_up',
}

@Entity('medical_records')
@Index(['patientId'])
@Index(['providerId'])
@Index(['encounterId'])
@Index(['createdAt'])
export class MedicalRecord {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  patientId: string;

  @Column('uuid')
  providerId: string;

  @Column('uuid', { nullable: true })
  encounterId: string;

  @Column('uuid', { nullable: true })
  appointmentId: string;

  @Column({
    type: 'enum',
    enum: RecordType,
  })
  recordType: RecordType;

  @Column({ type: 'date' })
  encounterDate: Date;

  @Column({ type: 'text' })
  chiefComplaint: string;

  @Column({ type: 'text' })
  historyOfPresentIllness: string;

  @Column({ type: 'text', nullable: true })
  reviewOfSystems: string;

  @Column({ type: 'jsonb', nullable: true })
  pastMedicalHistory: {
    conditions: string[];
    surgeries: string[];
    hospitalizations: string[];
  };

  @Column({ type: 'jsonb', nullable: true })
  familyHistory: {
    condition: string;
    relationship: string;
  }[];

  @Column({ type: 'jsonb', nullable: true })
  socialHistory: {
    smoking: string;
    alcohol: string;
    drugs: string;
    occupation: string;
    exercise: string;
    diet: string;
  };

  @Column({ type: 'text' })
  physicalExamination: string;

  @Column({ type: 'text' })
  assessment: string;

  @Column({ type: 'text' })
  plan: string;

  @Column({ type: 'jsonb', nullable: true })
  educationProvided: string[];

  @Column({ type: 'text', nullable: true })
  followUpInstructions: string;

  @Column({ type: 'jsonb', nullable: true })
  attachments: {
    type: string;
    url: string;
    name: string;
  }[];

  @Column({ default: false })
  isEncrypted: boolean;

  @Column({ nullable: true })
  encryptionKeyId: string;

  @Column({ type: 'jsonb', nullable: true })
  accessLog: {
    userId: string;
    accessTime: Date;
    action: string;
  }[];

  @OneToMany(() => Prescription, prescription => prescription.medicalRecord)
  prescriptions: Prescription[];

  @OneToMany(() => LabResult, labResult => labResult.medicalRecord)
  labResults: LabResult[];

  @OneToMany(() => ClinicalNote, note => note.medicalRecord)
  clinicalNotes: ClinicalNote[];

  @OneToMany(() => Vitals, vitals => vitals.medicalRecord)
  vitals: Vitals[];

  @OneToMany(() => Diagnosis, diagnosis => diagnosis.medicalRecord)
  diagnoses: Diagnosis[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column('uuid')
  createdBy: string;

  @Column('uuid', { nullable: true })
  updatedBy: string;
}
