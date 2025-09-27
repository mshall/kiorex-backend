import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
  Index,
} from 'typeorm';
import { UserAuth } from './user-auth.entity';

export enum MfaType {
  TOTP = 'totp',
  SMS = 'sms',
  EMAIL = 'email',
  BACKUP_CODES = 'backup_codes',
}

@Entity('mfa_secrets')
@Index(['userId', 'type'])
export class MfaSecret {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'user_id' })
  userId: string;

  @ManyToOne(() => UserAuth, (user) => user.mfaSecrets, {
    onDelete: 'CASCADE',
  })
  user: UserAuth;

  @Column({
    type: 'enum',
    enum: MfaType,
  })
  type: MfaType;

  @Column({ select: false })
  secret: string;

  @Column({ name: 'backup_codes', type: 'simple-array', nullable: true, select: false })
  backupCodes?: string[];

  @Column({ default: false })
  isVerified: boolean;

  @Column({ name: 'verified_at', type: 'timestamptz', nullable: true })
  verifiedAt?: Date;

  @Column({ name: 'last_used', type: 'timestamptz', nullable: true })
  lastUsed?: Date;

  @Column({ name: 'use_count', default: 0 })
  useCount: number;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;
}