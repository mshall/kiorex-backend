import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';

export enum InteractionSeverity {
  MINOR = 'minor',
  MODERATE = 'moderate',
  MAJOR = 'major',
  CONTRAINDICATED = 'contraindicated',
}

@Entity('medication_interactions')
@Index(['medication1Id'])
@Index(['medication2Id'])
@Index(['severity'])
export class MedicationInteraction {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  medication1Id: string;

  @Column()
  medication1Name: string;

  @Column('uuid')
  medication2Id: string;

  @Column()
  medication2Name: string;

  @Column({ type: 'enum', enum: InteractionSeverity })
  severity: InteractionSeverity;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'text', nullable: true })
  mechanism?: string;

  @Column({ type: 'text', nullable: true })
  clinicalEffects?: string;

  @Column({ type: 'text', nullable: true })
  management?: string;

  @Column({ type: 'text', nullable: true })
  monitoring?: string;

  @Column({ type: 'jsonb', nullable: true })
  references?: string[];

  @Column({ default: true })
  isActive: boolean;

  @Column({ nullable: true })
  lastUpdated?: Date;

  @Column({ nullable: true })
  updatedBy?: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
