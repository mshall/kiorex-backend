import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
  ManyToOne,
  JoinColumn,
  OneToOne,
} from 'typeorm';
import { LabTest } from './lab-test.entity';
import { LabPartner } from './lab-partner.entity';
import { LabResult } from './lab-result.entity';

export enum BookingStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
  NO_SHOW = 'no_show',
}

export enum CollectionType {
  LAB_VISIT = 'lab_visit',
  HOME_COLLECTION = 'home_collection',
}

@Entity('lab_bookings')
@Index(['patientId'])
@Index(['status'])
@Index(['scheduledDateTime'])
@Index(['collectionType'])
export class LabBooking {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  testId: string;

  @ManyToOne(() => LabTest, (test) => test.bookings)
  @JoinColumn({ name: 'testId' })
  test: LabTest;

  @Column()
  labId: string;

  @ManyToOne(() => LabPartner, (lab) => lab.bookings)
  @JoinColumn({ name: 'labId' })
  lab: LabPartner;

  @Column()
  patientId: string;

  @Column({ type: 'timestamp' })
  scheduledDateTime: Date;

  @Column({
    type: 'enum',
    enum: CollectionType,
  })
  collectionType: CollectionType;

  @Column({ type: 'text', nullable: true })
  address?: string;

  @Column({ nullable: true })
  contactPhone?: string;

  @Column({ nullable: true })
  preferredTimeSlot?: string;

  @Column({ type: 'text', nullable: true })
  notes?: string;

  @Column({ type: 'int', default: 1 })
  quantity: number;

  @Column({ nullable: true })
  appointmentId?: string; // If booked during consultation

  @Column({
    type: 'enum',
    enum: BookingStatus,
    default: BookingStatus.PENDING,
  })
  status: BookingStatus;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  totalAmount: number;

  @Column({ nullable: true })
  paymentId?: string;

  @Column({ type: 'text', nullable: true })
  cancellationReason?: string;

  @Column({ type: 'timestamp', nullable: true })
  cancelledAt?: Date;

  @Column({ type: 'timestamp', nullable: true })
  completedAt?: Date;

  @Column({ type: 'timestamp', nullable: true })
  collectionDateTime?: Date;

  @Column({ nullable: true })
  collectionPersonName?: string;

  @Column({ nullable: true })
  collectionPersonPhone?: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToOne(() => LabResult, (result) => result.booking)
  result?: LabResult;

  // Virtual properties
  get isCompleted(): boolean {
    return this.status === BookingStatus.COMPLETED;
  }

  get isCancelled(): boolean {
    return this.status === BookingStatus.CANCELLED;
  }

  get isPending(): boolean {
    return this.status === BookingStatus.PENDING;
  }

  get isConfirmed(): boolean {
    return this.status === BookingStatus.CONFIRMED;
  }

  get isHomeCollection(): boolean {
    return this.collectionType === CollectionType.HOME_COLLECTION;
  }
}
