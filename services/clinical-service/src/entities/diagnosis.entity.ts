import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { MedicalRecord } from './medical-record.entity';

export enum DiagnosisType {
  PRIMARY = 'primary',
  SECONDARY = 'secondary',
  DIFFERENTIAL = 'differential',
  ADMISSION = 'admission',
  DISCHARGE = 'discharge',
}

@Entity('diagnoses')
@Index(['patientId'])
@Index(['medicalRecordId'])
@Index(['icdCode'])
export class Diagnosis {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  patientId: string;

  @Column('uuid')
  medicalRecordId: string;

  @ManyToOne(() => MedicalRecord)
  @JoinColumn({ name: 'medicalRecordId' })
  medicalRecord: MedicalRecord;

  @Column()
  icdCode: string; // ICD-10 code

  @Column()
  description: string;

  @Column({
    type: 'enum',
    enum: DiagnosisType,
    default: DiagnosisType.PRIMARY,
  })
  type: DiagnosisType;

  @Column({ default: true })
  isActive: boolean;

  @Column({ type: 'date' })
  diagnosedDate: Date;

  @Column({ type: 'date', nullable: true })
  resolvedDate: Date;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @Column('uuid')
  diagnosedBy: string;

  @CreateDateColumn()
  createdAt: Date;
}
