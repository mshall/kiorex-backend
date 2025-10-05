import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
  OneToMany,
} from 'typeorm';
import { InventoryItem } from './inventory-item.entity';

export enum SupplierStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  SUSPENDED = 'suspended',
}

@Entity('suppliers')
@Index(['email'])
@Index(['status'])
@Index(['name'])
export class Supplier {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ type: 'text' })
  description: string;

  @Column()
  email: string;

  @Column()
  phone: string;

  @Column({ type: 'text' })
  address: string;

  @Column({ nullable: true })
  contactPerson?: string;

  @Column({ nullable: true })
  contactPhone?: string;

  @Column({ nullable: true })
  contactEmail?: string;

  @Column({ nullable: true })
  website?: string;

  @Column({ nullable: true })
  paymentTerms?: string;

  @Column({ nullable: true })
  taxId?: string;

  @Column({ type: 'text', nullable: true })
  certifications?: string;

  @Column({
    type: 'enum',
    enum: SupplierStatus,
    default: SupplierStatus.ACTIVE,
  })
  status: SupplierStatus;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => InventoryItem, (item) => item.supplier)
  items: InventoryItem[];

  // Virtual properties
  get isActive(): boolean {
    return this.status === SupplierStatus.ACTIVE;
  }

  get fullContactInfo(): string {
    return `${this.contactPerson || this.name} - ${this.contactPhone || this.phone} - ${this.contactEmail || this.email}`;
  }
}
