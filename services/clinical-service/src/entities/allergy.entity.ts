import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';

export enum AllergyType {
  DRUG = 'drug',
  FOOD = 'food',
  ENVIRONMENTAL = 'environmental',
  CONTACT = 'contact',
  INSECT = 'insect',
}

export enum SeverityLevel {
  MILD = 'mild',
  MODERATE = 'moderate',
  SEVERE = 'severe',
  LIFE_THREATENING = 'life_threatening',
}

@Entity('allergies')
@Index(['patientId'])
@Index(['allergen'])
@Index(['severity'])
export class Allergy {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  patientId: string;

  @Column()
  allergen: string;

  @Column({
    type: 'enum',
    enum: AllergyType,
  })
  type: AllergyType;

  @Column({
    type: 'enum',
    enum: SeverityLevel,
  })
  severity: SeverityLevel;

  @Column({ type: 'text' })
  reaction: string;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @Column({ type: 'date' })
  onsetDate: Date;

  @Column({ type: 'date', nullable: true })
  lastOccurrence: Date;

  @Column({ default: true })
  isActive: boolean;

  @Column('uuid')
  reportedBy: string;

  @Column({ type: 'jsonb', nullable: true })
  symptoms: string[];

  @Column({ type: 'jsonb', nullable: true })
  treatments: {
    medication: string;
    effectiveness: string;
  }[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
