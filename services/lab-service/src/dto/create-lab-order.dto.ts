import { IsString, IsUUID, IsOptional, IsArray, ValidateNested, IsEnum } from 'class-validator';
import { Type } from 'class-transformer';

export enum LabOrderStatus {
  PENDING = 'pending',
  COLLECTED = 'collected',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

export enum LabOrderPriority {
  ROUTINE = 'routine',
  URGENT = 'urgent',
  STAT = 'stat',
}

export class LabTestDto {
  @IsString()
  testCode: string;

  @IsString()
  testName: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  specimenType?: string;

  @IsOptional()
  @IsString()
  instructions?: string;
}

export class CreateLabOrderDto {
  @IsUUID()
  patientId: string;

  @IsUUID()
  providerId: string;

  @IsOptional()
  @IsUUID()
  appointmentId?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => LabTestDto)
  tests: LabTestDto[];

  @IsOptional()
  @IsEnum(LabOrderPriority)
  priority?: LabOrderPriority;

  @IsOptional()
  @IsString()
  clinicalNotes?: string;

  @IsOptional()
  @IsString()
  instructions?: string;

  @IsOptional()
  @IsString()
  fastingRequired?: string;

  @IsOptional()
  @IsString()
  specialInstructions?: string;
}
