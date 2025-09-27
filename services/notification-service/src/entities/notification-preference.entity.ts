import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';

@Entity('notification_preferences')
@Index(['userId'])
export class NotificationPreference {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid', { unique: true })
  userId: string;

  @Column({ default: true })
  enabled: boolean;

  @Column({ default: true })
  email: boolean;

  @Column({ default: false })
  sms: boolean;

  @Column({ default: true })
  push: boolean;

  @Column({ default: true })
  inApp: boolean;

  @Column({ default: false })
  quietHours: boolean;

  @Column({ type: 'int', nullable: true })
  quietHoursStart: number; // 0-23

  @Column({ type: 'int', nullable: true })
  quietHoursEnd: number; // 0-23

  @Column({ type: 'jsonb', nullable: true })
  preferences: {
    [key: string]: {
      email?: boolean;
      sms?: boolean;
      push?: boolean;
      inApp?: boolean;
    };
  };

  @Column({ type: 'jsonb', nullable: true })
  channels: {
    email?: string;
    phone?: string;
    pushToken?: string;
  };

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
