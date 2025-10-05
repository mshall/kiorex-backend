import { IsString, IsUUID, IsOptional, IsNumber, IsEnum, IsDateString, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export enum LabResultStatus {
  PENDING = 'pending',
  COMPLETED = 'completed',
  ABNORMAL = 'abnormal',
  CRITICAL = 'critical',
}

export class LabValueDto {
  @IsString()
  testCode: string;

  @IsString()
  testName: string;

  @IsOptional()
  @IsString()
  value?: string;

  @IsOptional()
  @IsNumber()
  numericValue?: number;

  @IsOptional()
  @IsString()
  unit?: string;

  @IsOptional()
  @IsString()
  referenceRange?: string;

  @IsOptional()
  @IsString()
  flag?: string; // H, L, A, etc.

  @IsOptional()
  @IsString()
  status?: string;
}

export class CreateLabResultDto {
  @IsUUID()
  labOrderId: string;

  @IsUUID()
  patientId: string;

  @IsUUID()
  providerId: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => LabValueDto)
  results: LabValueDto[];

  @IsOptional()
  @IsEnum(LabResultStatus)
  status?: LabResultStatus;

  @IsOptional()
  @IsString()
  interpretation?: string;

  @IsOptional()
  @IsString()
  comments?: string;

  @IsOptional()
  @IsString()
  methodology?: string;

  @IsOptional()
  @IsString()
  equipment?: string;

  @IsOptional()
  @IsDateString()
  completedAt?: Date;

  @IsOptional()
  @IsUUID()
  reviewedBy?: string;

  @IsOptional()
  @IsDateString()
  reviewedAt?: Date;
}
