import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
  OneToMany,
} from 'typeorm';
import { LabBooking } from './lab-booking.entity';

export enum LabStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  SUSPENDED = 'suspended',
  PENDING_VERIFICATION = 'pending_verification',
}

@Entity('lab_partners')
@Index(['status'])
@Index(['location'])
@Index(['rating'])
export class LabPartner {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ type: 'text' })
  description: string;

  @Column()
  address: string;

  @Column()
  city: string;

  @Column()
  state: string;

  @Column()
  pincode: string;

  @Column()
  phone: string;

  @Column()
  email: string;

  @Column({ nullable: true })
  website?: string;

  @Column({ type: 'decimal', precision: 3, scale: 2, default: 0 })
  rating: number;

  @Column({ type: 'int', default: 0 })
  reviewCount: number;

  @Column({
    type: 'enum',
    enum: LabStatus,
    default: LabStatus.PENDING_VERIFICATION,
  })
  status: LabStatus;

  @Column({ type: 'jsonb', nullable: true })
  operatingHours?: {
    monday: { open: string; close: string; closed: boolean };
    tuesday: { open: string; close: string; closed: boolean };
    wednesday: { open: string; close: string; closed: boolean };
    thursday: { open: string; close: string; closed: boolean };
    friday: { open: string; close: string; closed: boolean };
    saturday: { open: string; close: string; closed: boolean };
    sunday: { open: string; close: string; closed: boolean };
  };

  @Column({ type: 'jsonb', nullable: true })
  facilities?: string[];

  @Column({ type: 'jsonb', nullable: true })
  certifications?: string[];

  @Column({ type: 'decimal', precision: 10, scale: 6, nullable: true })
  latitude?: number;

  @Column({ type: 'decimal', precision: 10, scale: 6, nullable: true })
  longitude?: number;

  @Column({ default: true })
  homeCollectionAvailable: boolean;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  homeCollectionFee?: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => LabBooking, (booking) => booking.lab)
  bookings: LabBooking[];

  // Virtual properties
  get isActive(): boolean {
    return this.status === LabStatus.ACTIVE;
  }

  get fullAddress(): string {
    return `${this.address}, ${this.city}, ${this.state} - ${this.pincode}`;
  }

  get isVerified(): boolean {
    return this.status === LabStatus.ACTIVE;
  }
}
