import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';

export enum MedicationCategory {
  PRESCRIPTION = 'prescription',
  OVER_THE_COUNTER = 'over_the_counter',
  SUPPLEMENT = 'supplement',
  HERBAL = 'herbal',
}

@Entity('medications')
@Index(['name'])
@Index(['category'])
@Index(['isActive'])
export class Medication {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  name: string;

  @Column({ nullable: true })
  genericName: string;

  @Column({ nullable: true })
  brandName: string;

  @Column({
    type: 'enum',
    enum: MedicationCategory,
  })
  category: MedicationCategory;

  @Column({ nullable: true })
  ndcCode: string; // National Drug Code

  @Column({ nullable: true })
  rxNormCode: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'jsonb', nullable: true })
  activeIngredients: {
    name: string;
    strength: string;
  }[];

  @Column({ type: 'jsonb', nullable: true })
  indications: string[];

  @Column({ type: 'jsonb', nullable: true })
  contraindications: string[];

  @Column({ type: 'jsonb', nullable: true })
  sideEffects: string[];

  @Column({ type: 'jsonb', nullable: true })
  interactions: {
    drug: string;
    severity: string;
    description: string;
  }[];

  @Column({ default: false })
  isControlled: boolean;

  @Column({ nullable: true })
  deaSchedule: string;

  @Column({ default: false })
  requiresPrescription: boolean;

  @Column({ default: true })
  isActive: boolean;

  @Column({ type: 'jsonb', nullable: true })
  dosageForms: string[];

  @Column({ type: 'jsonb', nullable: true })
  strengths: string[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
