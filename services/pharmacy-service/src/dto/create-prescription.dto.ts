import { IsString, IsUUID, IsOptional, IsNumber, IsEnum, IsDateString, IsArray } from 'class-validator';
import { PrescriptionPriority } from '../entities/prescription.entity';

export class CreatePrescriptionDto {
  @IsUUID()
  patientId: string;

  @IsUUID()
  providerId: string;

  @IsOptional()
  @IsUUID()
  appointmentId?: string;

  @IsOptional()
  @IsUUID()
  medicationId?: string;

  @IsString()
  medicationName: string;

  @IsOptional()
  @IsString()
  genericName?: string;

  @IsString()
  dosage: string;

  @IsString()
  frequency: string;

  @IsString()
  duration: string;

  @IsOptional()
  @IsNumber()
  quantity?: number;

  @IsOptional()
  @IsString()
  instructions?: string;

  @IsOptional()
  @IsString()
  clinicalNotes?: string;

  @IsOptional()
  @IsEnum(PrescriptionPriority)
  priority?: PrescriptionPriority;

  @IsOptional()
  @IsString()
  prescribedBy?: string;

  @IsOptional()
  @IsDateString()
  prescribedAt?: Date;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  drugInteractions?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  allergies?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  contraindications?: string[];

  @IsOptional()
  @IsNumber()
  totalCost?: number;

  @IsOptional()
  @IsNumber()
  patientCost?: number;

  @IsOptional()
  @IsNumber()
  insuranceCost?: number;

  @IsOptional()
  @IsString()
  insuranceCoverage?: string;

  @IsOptional()
  @IsString()
  priorAuthorization?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  sideEffects?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  monitoring?: string[];

  @IsOptional()
  @IsDateString()
  followUpDate?: Date;

  @IsOptional()
  @IsString()
  followUpNotes?: string;
}
