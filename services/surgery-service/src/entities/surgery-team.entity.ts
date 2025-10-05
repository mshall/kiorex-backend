import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';

export enum TeamMemberRole {
  SURGEON = 'surgeon',
  ASSISTANT_SURGEON = 'assistant_surgeon',
  ANESTHESIOLOGIST = 'anesthesiologist',
  NURSE = 'nurse',
  TECHNICIAN = 'technician',
  RESIDENT = 'resident',
  INTERN = 'intern',
  OBSERVER = 'observer',
}

@Entity('surgery_teams')
@Index(['surgeryId'])
@Index(['memberId'])
@Index(['role'])
export class SurgeryTeam {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  surgeryId: string;

  @Column('uuid')
  memberId: string;

  @Column()
  memberName: string;

  @Column({ type: 'enum', enum: TeamMemberRole })
  role: TeamMemberRole;

  @Column({ nullable: true })
  specialty?: string;

  @Column({ nullable: true })
  licenseNumber?: string;

  @Column({ nullable: true })
  contactInfo?: string;

  @Column({ type: 'text', nullable: true })
  notes?: string;

  @Column({ default: true })
  isActive: boolean;

  @Column({ nullable: true })
  assignedBy?: string;

  @Column({ nullable: true })
  assignedAt?: Date;

  @Column({ nullable: true })
  confirmedAt?: Date;

  @Column({ nullable: true })
  declinedAt?: Date;

  @Column({ nullable: true })
  declineReason?: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
