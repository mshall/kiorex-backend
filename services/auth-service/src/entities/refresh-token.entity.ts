import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
  Index,
} from 'typeorm';
import { UserAuth } from './user-auth.entity';

@Entity('refresh_tokens')
@Index(['token'], { unique: true })
@Index(['userId', 'isRevoked'])
export class RefreshToken {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  token: string;

  @Column({ name: 'user_id' })
  userId: string;

  @ManyToOne(() => UserAuth, (user) => user.refreshTokens, {
    onDelete: 'CASCADE',
  })
  user: UserAuth;

  @Column({ name: 'device_id', nullable: true })
  deviceId?: string;

  @Column({ name: 'device_name', nullable: true })
  deviceName?: string;

  @Column({ name: 'ip_address', nullable: true })
  ipAddress?: string;

  @Column({ name: 'user_agent', nullable: true })
  userAgent?: string;

  @Column({ type: 'timestamptz' })
  expiresAt: Date;

  @Column({ default: false })
  isRevoked: boolean;

  @Column({ name: 'revoked_at', type: 'timestamptz', nullable: true })
  revokedAt?: Date;

  @Column({ name: 'revoked_reason', nullable: true })
  revokedReason?: string;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;
}