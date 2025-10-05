import { IsString, IsUUID, IsOptional, IsNumber, IsEnum, IsDateString } from 'class-validator';
import { InventoryTransactionType } from '../entities/inventory.entity';

export class CreateInventoryDto {
  @IsUUID()
  medicationId: string;

  @IsString()
  medicationName: string;

  @IsEnum(InventoryTransactionType)
  transactionType: InventoryTransactionType;

  @IsNumber()
  quantity: number;

  @IsOptional()
  @IsNumber()
  unitCost?: number;

  @IsOptional()
  @IsString()
  batchNumber?: string;

  @IsOptional()
  @IsDateString()
  expiryDate?: Date;

  @IsOptional()
  @IsString()
  supplier?: string;

  @IsOptional()
  @IsString()
  invoiceNumber?: string;

  @IsOptional()
  @IsString()
  reference?: string;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsOptional()
  @IsString()
  performedBy?: string;

  @IsOptional()
  @IsDateString()
  transactionDate?: Date;

  @IsOptional()
  @IsUUID()
  prescriptionId?: string;

  @IsOptional()
  @IsUUID()
  patientId?: string;

  @IsOptional()
  @IsString()
  reason?: string;
}
