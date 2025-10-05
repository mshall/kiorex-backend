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

export enum TestCategory {
  BLOOD_TEST = 'blood_test',
  URINE_TEST = 'urine_test',
  STOOL_TEST = 'stool_test',
  IMAGING = 'imaging',
  CARDIAC = 'cardiac',
  DIABETES = 'diabetes',
  THYROID = 'thyroid',
  LIVER = 'liver',
  KIDNEY = 'kidney',
  VITAMIN = 'vitamin',
  HORMONE = 'hormone',
  INFECTIOUS_DISEASE = 'infectious_disease',
  CANCER_SCREENING = 'cancer_screening',
}

export enum TestType {
  SINGLE = 'single',
  PACKAGE = 'package',
  PROFILE = 'profile',
}

@Entity('lab_tests')
@Index(['category'])
@Index(['type'])
@Index(['isActive'])
export class LabTest {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ type: 'text' })
  description: string;

  @Column({
    type: 'enum',
    enum: TestCategory,
  })
  category: TestCategory;

  @Column({
    type: 'enum',
    enum: TestType,
  })
  type: TestType;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number;

  @Column({ type: 'int' })
  duration: number; // in hours

  @Column({ type: 'text', nullable: true })
  preparation?: string;

  @Column({ nullable: true })
  sampleType?: string;

  @Column({ type: 'text', nullable: true })
  normalRange?: string;

  @Column({ type: 'jsonb', nullable: true })
  parameters?: string[];

  @Column({ default: true })
  homeCollectionAvailable: boolean;

  @Column({ default: true })
  isActive: boolean;

  @Column({ nullable: true })
  imageUrl?: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => LabBooking, (booking) => booking.test)
  bookings: LabBooking[];

  // Virtual properties
  get isPackage(): boolean {
    return this.type === TestType.PACKAGE;
  }

  get isProfile(): boolean {
    return this.type === TestType.PROFILE;
  }
}
