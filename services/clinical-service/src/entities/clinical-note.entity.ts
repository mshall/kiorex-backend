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

export enum NoteType {
  SOAP = 'soap',
  PROGRESS = 'progress',
  CONSULTATION = 'consultation',
  DISCHARGE = 'discharge',
  NURSING = 'nursing',
  PROCEDURE = 'procedure',
}

@Entity('clinical_notes')
@Index(['patientId'])
@Index(['authorId'])
@Index(['noteType'])
@Index(['createdAt'])
export class ClinicalNote {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  patientId: string;

  @Column('uuid')
  authorId: string;

  @ManyToOne(() => MedicalRecord, { nullable: true })
  @JoinColumn()
  medicalRecord: MedicalRecord;

  @Column({
    type: 'enum',
    enum: NoteType,
  })
  noteType: NoteType;

  @Column({ type: 'text' })
  content: string;

  @Column({ type: 'text', nullable: true })
  subjective: string; // For SOAP notes

  @Column({ type: 'text', nullable: true })
  objective: string; // For SOAP notes

  @Column({ type: 'text', nullable: true })
  assessment: string; // For SOAP notes

  @Column({ type: 'text', nullable: true })
  plan: string; // For SOAP notes

  @Column({ type: 'jsonb', nullable: true })
  vitalSigns: {
    bloodPressure?: string;
    heartRate?: number;
    temperature?: number;
    respiratoryRate?: number;
    oxygenSaturation?: number;
    weight?: number;
    height?: number;
    bmi?: number;
  };

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

  @Column({ default: false })
  isDraft: boolean;

  @Column({ type: 'timestamp', nullable: true })
  signedAt: Date;

  @Column({ nullable: true })
  signedBy: string;

  @Column({ type: 'jsonb', nullable: true })
  accessLog: {
    userId: string;
    accessTime: Date;
    action: string;
  }[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
