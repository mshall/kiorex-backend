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

@Entity('vitals')
@Index(['patientId'])
@Index(['recordedBy'])
@Index(['recordedAt'])
export class Vitals {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  patientId: string;

  @Column('uuid')
  recordedBy: string;

  @ManyToOne(() => MedicalRecord, { nullable: true })
  @JoinColumn()
  medicalRecord: MedicalRecord;

  @Column({ type: 'timestamp' })
  recordedAt: Date;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  height: number; // in cm

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  weight: number; // in kg

  @Column({ type: 'decimal', precision: 4, scale: 2, nullable: true })
  bmi: number;

  @Column({ type: 'decimal', precision: 4, scale: 1, nullable: true })
  temperature: number; // in Celsius

  @Column({ type: 'int', nullable: true })
  heartRate: number; // bpm

  @Column({ type: 'int', nullable: true })
  respiratoryRate: number; // breaths per minute

  @Column({ type: 'int', nullable: true })
  oxygenSaturation: number; // percentage

  @Column({ type: 'int', nullable: true })
  systolicBP: number; // mmHg

  @Column({ type: 'int', nullable: true })
  diastolicBP: number; // mmHg

  @Column({ type: 'int', nullable: true })
  painLevel: number; // 0-10 scale

  @Column({ type: 'text', nullable: true })
  painLocation: string;

  @Column({ type: 'text', nullable: true })
  painDescription: string;

  @Column({ type: 'jsonb', nullable: true })
  additionalVitals: {
    [key: string]: any;
  };

  @Column({ type: 'text', nullable: true })
  notes: string;

  @CreateDateColumn()
  createdAt: Date;
}
