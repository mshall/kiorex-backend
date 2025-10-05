import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';

export enum RoomStatus {
  AVAILABLE = 'available',
  OCCUPIED = 'occupied',
  MAINTENANCE = 'maintenance',
  OUT_OF_ORDER = 'out_of_order',
}

export enum RoomType {
  OPERATING_ROOM = 'operating_room',
  RECOVERY_ROOM = 'recovery_room',
  PREP_ROOM = 'prep_room',
  HOLDING_ROOM = 'holding_room',
}

@Entity('surgery_rooms')
@Index(['roomNumber'])
@Index(['status'])
@Index(['type'])
export class SurgeryRoom {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  roomNumber: string;

  @Column()
  name: string;

  @Column({ type: 'enum', enum: RoomType })
  type: RoomType;

  @Column({ type: 'enum', enum: RoomStatus, default: RoomStatus.AVAILABLE })
  status: RoomStatus;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ type: 'jsonb', nullable: true })
  equipment?: string[];

  @Column({ type: 'jsonb', nullable: true })
  capabilities?: string[];

  @Column({ type: 'int', nullable: true })
  capacity?: number;

  @Column({ type: 'decimal', precision: 8, scale: 2, nullable: true })
  size?: number; // in square meters

  @Column({ nullable: true })
  floor?: string;

  @Column({ nullable: true })
  wing?: string;

  @Column({ nullable: true })
  building?: string;

  @Column({ default: true })
  isActive: boolean;

  @Column({ type: 'jsonb', nullable: true })
  maintenanceSchedule?: {
    lastMaintenance?: Date;
    nextMaintenance?: Date;
    maintenanceType?: string;
    notes?: string;
  };

  @Column({ type: 'jsonb', nullable: true })
  availability?: {
    monday?: { start: string; end: string; available: boolean }[];
    tuesday?: { start: string; end: string; available: boolean }[];
    wednesday?: { start: string; end: string; available: boolean }[];
    thursday?: { start: string; end: string; available: boolean }[];
    friday?: { start: string; end: string; available: boolean }[];
    saturday?: { start: string; end: string; available: boolean }[];
    sunday?: { start: string; end: string; available: boolean }[];
  };

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  hourlyRate?: number;

  @Column({ type: 'jsonb', nullable: true })
  restrictions?: string[];

  @Column({ type: 'jsonb', nullable: true })
  specialRequirements?: string[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
