import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
  OneToMany,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { StockMovement } from './stock-movement.entity';
import { Supplier } from './supplier.entity';

export enum ItemCategory {
  MEDICATION = 'medication',
  MEDICAL_SUPPLIES = 'medical_supplies',
  EQUIPMENT = 'equipment',
  LAB_SUPPLIES = 'lab_supplies',
  SURGICAL_INSTRUMENTS = 'surgical_instruments',
  CONSUMABLES = 'consumables',
}

export enum ItemStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  DISCONTINUED = 'discontinued',
}

@Entity('inventory_items')
@Index(['sku'], { unique: true })
@Index(['category'])
@Index(['status'])
@Index(['currentStock'])
export class InventoryItem {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ unique: true })
  sku: string;

  @Column({ nullable: true })
  unit?: string;

  @Column({
    type: 'enum',
    enum: ItemCategory,
  })
  category: ItemCategory;

  @Column({ type: 'int', default: 0 })
  currentStock: number;

  @Column({ type: 'int', default: 0 })
  minimumStock: number;

  @Column({ type: 'int', default: 1000 })
  maximumStock: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  unitCost: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  unitPrice: number;

  @Column({ nullable: true })
  supplierId?: string;

  @ManyToOne(() => Supplier, { nullable: true })
  @JoinColumn({ name: 'supplierId' })
  supplier?: Supplier;

  @Column({ type: 'date', nullable: true })
  expiryDate?: Date;

  @Column({ nullable: true })
  batchNumber?: string;

  @Column({ type: 'text', nullable: true })
  storageInstructions?: string;

  @Column({ default: false })
  requiresPrescription: boolean;

  @Column({ default: false })
  isControlledSubstance: boolean;

  @Column({
    type: 'enum',
    enum: ItemStatus,
    default: ItemStatus.ACTIVE,
  })
  status: ItemStatus;

  @Column({ nullable: true })
  imageUrl?: string;

  @Column({ nullable: true })
  barcode?: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => StockMovement, (movement) => movement.item)
  stockMovements: StockMovement[];

  // Virtual properties
  get isLowStock(): boolean {
    return this.currentStock <= this.minimumStock;
  }

  get isOutOfStock(): boolean {
    return this.currentStock === 0;
  }

  get isExpired(): boolean {
    return this.expiryDate ? this.expiryDate < new Date() : false;
  }

  get isExpiringSoon(): boolean {
    if (!this.expiryDate) return false;
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
    return this.expiryDate <= thirtyDaysFromNow;
  }

  get totalValue(): number {
    return this.currentStock * this.unitCost;
  }
}
