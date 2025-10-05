import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  Index,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { InventoryItem } from './inventory-item.entity';

export enum StockMovementType {
  IN = 'in',
  OUT = 'out',
  ADJUSTMENT = 'adjustment',
  TRANSFER = 'transfer',
  EXPIRED = 'expired',
  DAMAGED = 'damaged',
}

@Entity('stock_movements')
@Index(['itemId'])
@Index(['type'])
@Index(['movementDate'])
@Index(['createdAt'])
export class StockMovement {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  itemId: string;

  @ManyToOne(() => InventoryItem, (item) => item.stockMovements)
  @JoinColumn({ name: 'itemId' })
  item: InventoryItem;

  @Column({
    type: 'enum',
    enum: StockMovementType,
  })
  type: StockMovementType;

  @Column({ type: 'int' })
  quantity: number;

  @Column({ type: 'int' })
  previousStock: number;

  @Column({ type: 'int' })
  newStock: number;

  @Column({ nullable: true })
  reason?: string;

  @Column({ nullable: true })
  supplierId?: string;

  @Column({ nullable: true })
  patientId?: string;

  @Column({ nullable: true })
  appointmentId?: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  movementDate: Date;

  @Column({ nullable: true })
  notes?: string;

  @Column({ nullable: true })
  batchNumber?: string;

  @Column({ type: 'date', nullable: true })
  expiryDate?: Date;

  @Column()
  performedBy: string; // User ID who performed the movement

  @CreateDateColumn()
  createdAt: Date;

  // Virtual properties
  get isInbound(): boolean {
    return this.type === StockMovementType.IN || this.type === StockMovementType.ADJUSTMENT;
  }

  get isOutbound(): boolean {
    return this.type === StockMovementType.OUT || this.type === StockMovementType.EXPIRED || this.type === StockMovementType.DAMAGED;
  }
}
