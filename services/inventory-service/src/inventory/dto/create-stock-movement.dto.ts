import { IsUUID, IsEnum, IsNumber, IsString, IsOptional, IsDateString, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { StockMovementType } from './create-item.dto';

export class CreateStockMovementDto {
  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440001' })
  @IsUUID()
  itemId: string;

  @ApiProperty({ enum: StockMovementType, example: StockMovementType.IN })
  @IsEnum(StockMovementType)
  type: StockMovementType;

  @ApiProperty({ example: 50 })
  @IsNumber()
  @Min(1)
  quantity: number;

  @ApiProperty({ example: 'Stock replenishment', required: false })
  @IsOptional()
  @IsString()
  reason?: string;

  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440002', required: false })
  @IsOptional()
  @IsUUID()
  supplierId?: string;

  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440003', required: false })
  @IsOptional()
  @IsUUID()
  patientId?: string;

  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440004', required: false })
  @IsOptional()
  @IsUUID()
  appointmentId?: string;

  @ApiProperty({ example: '2024-01-15T10:30:00Z', required: false })
  @IsOptional()
  @IsDateString()
  movementDate?: string;

  @ApiProperty({ example: 'Additional notes', required: false })
  @IsOptional()
  @IsString()
  notes?: string;

  @ApiProperty({ example: 'BATCH001', required: false })
  @IsOptional()
  @IsString()
  batchNumber?: string;

  @ApiProperty({ example: '2024-12-31', required: false })
  @IsOptional()
  @IsDateString()
  expiryDate?: string;
}
