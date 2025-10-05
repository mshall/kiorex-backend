import { IsString, IsUUID, IsOptional, IsEnum, IsDateString, IsNumber, IsArray, ValidateNested, IsBoolean } from 'class-validator';
import { Type } from 'class-transformer';
import { CareType, Priority } from '../entities/patient-care.entity';

export class CreatePatientCareDto {
  @IsUUID()
  patientId: string;

  @IsUUID()
  nurseId: string;

  @IsString()
  nurseName: string;

  @IsEnum(CareType)
  careType: CareType;

  @IsEnum(Priority)
  priority: Priority;

  @IsDateString()
  scheduledTime: Date;

  @IsString()
  description: string;

  @IsOptional()
  @IsString()
  instructions?: string;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsOptional()
  @IsUUID()
  supervisorId?: string;

  @IsOptional()
  @IsString()
  supervisorName?: string;

  @IsOptional()
  @IsBoolean()
  requiresFollowUp?: boolean;

  @IsOptional()
  @IsDateString()
  followUpTime?: Date;
}
