import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  Index,
} from 'typeorm';
import { VideoParticipant } from './video-participant.entity';

export enum SessionStatus {
  CREATED = 'created',
  WAITING = 'waiting',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

@Entity('video_sessions')
@Index(['appointmentId'])
@Index(['hostId'])
@Index(['status'])
export class VideoSession {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  appointmentId: string;

  @Column()
  roomName: string;

  @Column()
  roomSid: string;

  @Column('uuid')
  hostId: string;

  @Column({ type: 'timestamp' })
  scheduledStart: Date;

  @Column({ type: 'timestamp' })
  scheduledEnd: Date;

  @Column({ type: 'timestamp', nullable: true })
  actualStart: Date;

  @Column({ type: 'timestamp', nullable: true })
  actualEnd: Date;

  @Column({ type: 'int', nullable: true })
  duration: number; // in seconds

  @Column({
    type: 'enum',
    enum: SessionStatus,
    default: SessionStatus.CREATED,
  })
  status: SessionStatus;

  @Column({ type: 'jsonb', nullable: true })
  settings: {
    recordParticipantsOnConnect: boolean;
    maxParticipants: number;
    type: string;
    mediaRegion: string;
    videoCodecs: string[];
  };

  @Column({ type: 'jsonb', nullable: true })
  metadata: any;

  @OneToMany(() => VideoParticipant, participant => participant.session)
  participants: VideoParticipant[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
