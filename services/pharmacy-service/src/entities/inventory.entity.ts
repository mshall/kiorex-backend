import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';

export enum InventoryTransactionType {
  IN = 'in',
  OUT = 'out',
  ADJUSTMENT = 'adjustment',
  EXPIRED = 'expired',
  DAMAGED = 'damaged',
  RETURN = 'return',
}

@Entity('inventory')
@Index(['medicationId'])
@Index(['transactionType'])
@Index(['transactionDate'])
export class Inventory {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  medicationId: string;

  @Column()
  medicationName: string;

  @Column({ type: 'enum', enum: InventoryTransactionType })
  transactionType: InventoryTransactionType;

  @Column({ type: 'int' })
  quantity: number;

  @Column({ type: 'int' })
  previousQuantity: number;

  @Column({ type: 'int' })
  newQuantity: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  unitCost?: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  totalCost?: number;

  @Column({ nullable: true })
  batchNumber?: string;

  @Column({ nullable: true })
  expiryDate?: Date;

  @Column({ nullable: true })
  supplier?: string;

  @Column({ nullable: true })
  invoiceNumber?: string;

  @Column({ nullable: true })
  reference?: string;

  @Column({ nullable: true })
  notes?: string;

  @Column({ nullable: true })
  performedBy?: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  transactionDate: Date;

  @Column({ nullable: true })
  prescriptionId?: string;

  @Column({ nullable: true })
  patientId?: string;

  @Column({ nullable: true })
  reason?: string;

  @Column({ type: 'jsonb', nullable: true })
  metadata?: any;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
