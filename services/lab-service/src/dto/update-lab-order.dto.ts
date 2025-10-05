import { IsOptional, IsEnum, IsString, IsUUID, IsDateString } from 'class-validator';
import { LabOrderStatus } from './create-lab-order.dto';

export class UpdateLabOrderDto {
  @IsOptional()
  @IsEnum(LabOrderStatus)
  status?: LabOrderStatus;

  @IsOptional()
  @IsString()
  clinicalNotes?: string;

  @IsOptional()
  @IsString()
  instructions?: string;

  @IsOptional()
  @IsString()
  specialInstructions?: string;

  @IsOptional()
  @IsUUID()
  collectedBy?: string;

  @IsOptional()
  @IsDateString()
  collectedAt?: Date;

  @IsOptional()
  @IsUUID()
  processedBy?: string;

  @IsOptional()
  @IsDateString()
  processedAt?: Date;
}
