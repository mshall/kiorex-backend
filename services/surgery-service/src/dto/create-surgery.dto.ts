import { IsString, IsUUID, IsOptional, IsNumber, IsEnum, IsDateString, IsArray } from 'class-validator';
import { SurgeryType, SurgeryCategory } from '../entities/surgery.entity';

export class CreateSurgeryDto {
  @IsUUID()
  patientId: string;

  @IsUUID()
  surgeonId: string;

  @IsOptional()
  @IsUUID()
  appointmentId?: string;

  @IsString()
  procedureName: string;

  @IsEnum(SurgeryType)
  type: SurgeryType;

  @IsEnum(SurgeryCategory)
  category: SurgeryCategory;

  @IsDateString()
  scheduledDate: Date;

  @IsOptional()
  @IsNumber()
  estimatedDuration?: number;

  @IsOptional()
  @IsString()
  operatingRoom?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  preoperativeNotes?: string;

  @IsOptional()
  @IsString()
  anesthesia?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  equipment?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  medications?: string[];

  @IsOptional()
  @IsNumber()
  cost?: number;

  @IsOptional()
  @IsString()
  insuranceCoverage?: string;

  @IsOptional()
  @IsString()
  priorAuthorization?: string;

  @IsOptional()
  @IsString()
  consentForm?: string;

  @IsOptional()
  @IsDateString()
  followUpDate?: Date;
}
