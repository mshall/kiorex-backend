import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  Index,
} from 'typeorm';

export enum LogType {
  SENT = 'sent',
  DELIVERED = 'delivered',
  READ = 'read',
  FAILED = 'failed',
  BOUNCED = 'bounced',
  COMPLAINED = 'complained',
}

@Entity('notification_logs')
@Index(['notificationId'])
@Index(['userId'])
@Index(['type'])
@Index(['createdAt'])
export class NotificationLog {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  notificationId: string;

  @Column('uuid')
  userId: string;

  @Column()
  channel: string; // email, sms, push, in_app

  @Column({
    type: 'enum',
    enum: LogType,
  })
  type: LogType;

  @Column({ type: 'text', nullable: true })
  message: string;

  @Column({ type: 'jsonb', nullable: true })
  metadata: any;

  @Column({ type: 'text', nullable: true })
  errorMessage: string;

  @Column({ type: 'int', nullable: true })
  responseCode: number;

  @CreateDateColumn()
  createdAt: Date;
}
