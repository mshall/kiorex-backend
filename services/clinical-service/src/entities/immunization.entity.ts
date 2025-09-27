import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';

export enum ImmunizationStatus {
  COMPLETED = 'completed',
  NOT_GIVEN = 'not_given',
  PARTIALLY_GIVEN = 'partially_given',
  REFUSED = 'refused',
}

@Entity('immunizations')
@Index(['patientId'])
@Index(['vaccineCode'])
@Index(['administeredDate'])
export class Immunization {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  patientId: string;

  @Column()
  vaccineCode: string; // CVX code

  @Column()
  vaccineName: string;

  @Column({ type: 'date' })
  administeredDate: Date;

  @Column({
    type: 'enum',
    enum: ImmunizationStatus,
    default: ImmunizationStatus.COMPLETED,
  })
  status: ImmunizationStatus;

  @Column({ nullable: true })
  lotNumber: string;

  @Column({ nullable: true })
  manufacturer: string;

  @Column({ nullable: true })
  expirationDate: Date;

  @Column({ nullable: true })
  site: string; // Left arm, right arm, etc.

  @Column({ nullable: true })
  route: string; // IM, SC, etc.

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  dose: number;

  @Column({ nullable: true })
  doseUnit: string;

  @Column('uuid')
  administeredBy: string;

  @Column({ nullable: true })
  administeredAt: string; // Facility name

  @Column({ type: 'text', nullable: true })
  notes: string;

  @Column({ type: 'jsonb', nullable: true })
  adverseReactions: {
    reaction: string;
    severity: string;
    onsetDate: Date;
  }[];

  @Column({ type: 'jsonb', nullable: true })
  series: {
    series: string;
    doseNumber: number;
    totalDoses: number;
  };

  @Column({ type: 'date', nullable: true })
  nextDueDate: Date;

  @Column({ default: false })
  isContraindicated: boolean;

  @Column({ type: 'text', nullable: true })
  contraindicationReason: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
