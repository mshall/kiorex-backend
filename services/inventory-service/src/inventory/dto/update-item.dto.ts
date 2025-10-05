import { PartialType } from '@nestjs/swagger';
import { CreateItemDto } from './create-item.dto';
import { IsOptional, IsNumber, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateItemDto extends PartialType(CreateItemDto) {
  @ApiProperty({ example: 'Updated description', required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ example: 150, required: false })
  @IsOptional()
  @IsNumber()
  currentStock?: number;

  @ApiProperty({ example: 25, required: false })
  @IsOptional()
  @IsNumber()
  minimumStock?: number;

  @ApiProperty({ example: 600, required: false })
  @IsOptional()
  @IsNumber()
  maximumStock?: number;

  @ApiProperty({ example: 6.00, required: false })
  @IsOptional()
  @IsNumber()
  unitCost?: number;

  @ApiProperty({ example: 9.00, required: false })
  @IsOptional()
  @IsNumber()
  unitPrice?: number;
}
