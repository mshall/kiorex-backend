import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';

export enum AllergySeverity {
  MILD = 'mild',
  MODERATE = 'moderate',
  SEVERE = 'severe',
  LIFE_THREATENING = 'life_threatening',
}

export enum AllergyType {
  MEDICATION = 'medication',
  FOOD = 'food',
  ENVIRONMENTAL = 'environmental',
  CONTACT = 'contact',
}

@Entity('medication_allergies')
@Index(['patientId'])
@Index(['medicationId'])
@Index(['allergyType'])
@Index(['severity'])
export class MedicationAllergy {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  patientId: string;

  @Column('uuid', { nullable: true })
  medicationId?: string;

  @Column()
  medicationName: string;

  @Column({ type: 'enum', enum: AllergyType })
  allergyType: AllergyType;

  @Column({ type: 'enum', enum: AllergySeverity })
  severity: AllergySeverity;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ type: 'text', nullable: true })
  symptoms?: string;

  @Column({ type: 'text', nullable: true })
  treatment?: string;

  @Column({ type: 'text', nullable: true })
  notes?: string;

  @Column({ nullable: true })
  onsetDate?: Date;

  @Column({ nullable: true })
  lastOccurrence?: Date;

  @Column({ nullable: true })
  reportedBy?: string;

  @Column({ nullable: true })
  verifiedBy?: string;

  @Column({ nullable: true })
  verifiedAt?: Date;

  @Column({ default: true })
  isActive: boolean;

  @Column({ type: 'jsonb', nullable: true })
  crossReactions?: string[];

  @Column({ type: 'jsonb', nullable: true })
  alternativeMedications?: string[];

  @Column({ type: 'jsonb', nullable: true })
  documentation?: string[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
