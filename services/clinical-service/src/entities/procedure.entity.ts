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

export enum ProcedureType {
  DIAGNOSTIC = 'diagnostic',
  THERAPEUTIC = 'therapeutic',
  SURGICAL = 'surgical',
  PREVENTIVE = 'preventive',
  EMERGENCY = 'emergency',
}

export enum ProcedureStatus {
  SCHEDULED = 'scheduled',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
  POSTPONED = 'postponed',
}

@Entity('procedures')
@Index(['patientId'])
@Index(['providerId'])
@Index(['procedureCode'])
@Index(['status'])
export class Procedure {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  patientId: string;

  @Column('uuid')
  providerId: string;

  @ManyToOne(() => MedicalRecord, { nullable: true })
  @JoinColumn()
  medicalRecord: MedicalRecord;

  @Column()
  procedureCode: string; // CPT code

  @Column()
  procedureName: string;

  @Column({
    type: 'enum',
    enum: ProcedureType,
  })
  type: ProcedureType;

  @Column({
    type: 'enum',
    enum: ProcedureStatus,
    default: ProcedureStatus.SCHEDULED,
  })
  status: ProcedureStatus;

  @Column({ type: 'date' })
  scheduledDate: Date;

  @Column({ type: 'timestamp', nullable: true })
  startTime: Date;

  @Column({ type: 'timestamp', nullable: true })
  endTime: Date;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'text', nullable: true })
  indication: string;

  @Column({ type: 'text', nullable: true })
  findings: string;

  @Column({ type: 'text', nullable: true })
  complications: string;

  @Column({ type: 'text', nullable: true })
  followUpInstructions: string;

  @Column({ type: 'jsonb', nullable: true })
  anesthesia: {
    type: string;
    administeredBy: string;
    duration: number;
  };

  @Column({ type: 'jsonb', nullable: true })
  attachments: {
    type: string;
    url: string;
    name: string;
  }[];

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  cost: number;

  @Column({ nullable: true })
  location: string;

  @Column({ nullable: true })
  roomNumber: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
