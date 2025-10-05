import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';

@Entity('medications')
@Index(['name'])
@Index(['genericName'])
@Index(['category'])
export class Medication {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  genericName: string;

  @Column()
  category: string; // e.g., 'antibiotic', 'pain_relief', 'cardiovascular'

  @Column({ nullable: true })
  description?: string;

  @Column({ nullable: true })
  manufacturer?: string;

  @Column({ nullable: true })
  dosageForm?: string; // e.g., 'tablet', 'capsule', 'injection', 'cream'

  @Column({ nullable: true })
  strength?: string; // e.g., '500mg', '10ml'

  @Column({ type: 'jsonb', nullable: true })
  activeIngredients?: string[];

  @Column({ type: 'jsonb', nullable: true })
  sideEffects?: string[];

  @Column({ type: 'jsonb', nullable: true })
  contraindications?: string[];

  @Column({ type: 'jsonb', nullable: true })
  drugInteractions?: string[];

  @Column({ type: 'jsonb', nullable: true })
  storageInstructions?: string[];

  @Column({ type: 'jsonb', nullable: true })
  administrationInstructions?: string[];

  @Column({ default: true })
  isActive: boolean;

  @Column({ default: false })
  requiresPrescription: boolean;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  unitPrice?: number;

  @Column({ nullable: true })
  unit?: string; // e.g., 'per tablet', 'per ml'

  @Column({ nullable: true })
  ndc?: string; // National Drug Code

  @Column({ nullable: true })
  upc?: string; // Universal Product Code

  @Column({ nullable: true })
  barcode?: string;

  @Column({ default: 0 })
  stockQuantity: number;

  @Column({ nullable: true })
  minimumStockLevel?: number;

  @Column({ nullable: true })
  maximumStockLevel?: number;

  @Column({ nullable: true })
  expiryDate?: Date;

  @Column({ nullable: true })
  batchNumber?: string;

  @Column({ nullable: true })
  supplier?: string;

  @Column({ type: 'jsonb', nullable: true })
  images?: string[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
