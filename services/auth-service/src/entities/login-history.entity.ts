import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
  Index,
} from 'typeorm';
import { UserAuth } from './user-auth.entity';

export enum LoginStatus {
  SUCCESS = 'success',
  FAILED = 'failed',
  MFA_REQUIRED = 'mfa_required',
  BLOCKED = 'blocked',
}

@Entity('login_history')
@Index(['userId', 'createdAt'])
@Index(['ipAddress'])
export class LoginHistory {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'user_id' })
  userId: string;

  @ManyToOne(() => UserAuth, (user) => user.loginHistory, {
    onDelete: 'CASCADE',
  })
  user: UserAuth;

  @Column({
    type: 'enum',
    enum: LoginStatus,
  })
  status: LoginStatus;

  @Column({ name: 'ip_address' })
  ipAddress: string;

  @Column({ name: 'user_agent', nullable: true })
  userAgent?: string;

  @Column({ nullable: true })
  location?: string;

  @Column({ nullable: true })
  country?: string;

  @Column({ nullable: true })
  city?: string;

  @Column({ name: 'device_fingerprint', nullable: true })
  deviceFingerprint?: string;

  @Column({ name: 'failure_reason', nullable: true })
  failureReason?: string;

  @Column({ name: 'session_id', nullable: true })
  sessionId?: string;

  @Column({ type: 'jsonb', nullable: true })
  metadata?: Record<string, any>;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;
}