import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { VideoSession } from './video-session.entity';

@Entity('video_participants')
@Index(['sessionId'])
@Index(['userId'])
export class VideoParticipant {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  sessionId: string;

  @ManyToOne(() => VideoSession)
  @JoinColumn()
  session: VideoSession;

  @Column('uuid')
  userId: string;

  @Column({ default: false })
  isHost: boolean;

  @Column({ type: 'timestamp', nullable: true })
  joinedAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  leftAt: Date;

  @Column({ type: 'int', nullable: true })
  duration: number; // in seconds

  @Column({ type: 'jsonb', nullable: true })
  connectionQuality: {
    audio: string;
    video: string;
    network: string;
  };

  @Column({ type: 'jsonb', nullable: true })
  metadata: any;

  @CreateDateColumn()
  createdAt: Date;
}
