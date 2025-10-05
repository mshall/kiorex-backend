import { IsString, IsNumber, IsOptional, IsEnum, IsDateString, IsUUID, Min, IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export enum ItemCategory {
  MEDICATION = 'medication',
  MEDICAL_SUPPLIES = 'medical_supplies',
  EQUIPMENT = 'equipment',
  LAB_SUPPLIES = 'lab_supplies',
  SURGICAL_INSTRUMENTS = 'surgical_instruments',
  CONSUMABLES = 'consumables',
}

export enum ItemStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  DISCONTINUED = 'discontinued',
}

export enum StockMovementType {
  IN = 'in',
  OUT = 'out',
  ADJUSTMENT = 'adjustment',
  TRANSFER = 'transfer',
  EXPIRED = 'expired',
  DAMAGED = 'damaged',
}

export class CreateItemDto {
  @ApiProperty({ example: 'Paracetamol 500mg' })
  @IsString()
  name: string;

  @ApiProperty({ example: 'Pain relief medication' })
  @IsString()
  description: string;

  @ApiProperty({ example: 'PAR500' })
  @IsString()
  sku: string;

  @ApiProperty({ example: 'mg', required: false })
  @IsOptional()
  @IsString()
  unit?: string;

  @ApiProperty({ enum: ItemCategory, example: ItemCategory.MEDICATION })
  @IsEnum(ItemCategory)
  category: ItemCategory;

  @ApiProperty({ example: 100 })
  @IsNumber()
  @Min(0)
  currentStock: number;

  @ApiProperty({ example: 20 })
  @IsNumber()
  @Min(0)
  minimumStock: number;

  @ApiProperty({ example: 500 })
  @IsNumber()
  @Min(0)
  maximumStock: number;

  @ApiProperty({ example: 5.50 })
  @IsNumber()
  @Min(0)
  unitCost: number;

  @ApiProperty({ example: 8.00 })
  @IsNumber()
  @Min(0)
  unitPrice: number;

  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440001', required: false })
  @IsOptional()
  @IsUUID()
  supplierId?: string;

  @ApiProperty({ example: '2024-12-31', required: false })
  @IsOptional()
  @IsDateString()
  expiryDate?: string;

  @ApiProperty({ example: 'ABC123', required: false })
  @IsOptional()
  @IsString()
  batchNumber?: string;

  @ApiProperty({ example: 'Storage instructions', required: false })
  @IsOptional()
  @IsString()
  storageInstructions?: string;

  @ApiProperty({ example: true, required: false })
  @IsOptional()
  @IsBoolean()
  requiresPrescription?: boolean;

  @ApiProperty({ example: true, required: false })
  @IsOptional()
  @IsBoolean()
  isControlledSubstance?: boolean;

  @ApiProperty({ enum: ItemStatus, example: ItemStatus.ACTIVE, required: false })
  @IsOptional()
  @IsEnum(ItemStatus)
  status?: ItemStatus;

  @ApiProperty({ example: 'https://example.com/image.jpg', required: false })
  @IsOptional()
  @IsString()
  imageUrl?: string;
}
