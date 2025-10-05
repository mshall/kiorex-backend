import { PartialType } from '@nestjs/swagger';
import { CreateVitalsDto } from './create-vitals.dto';
import { IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateVitalsDto extends PartialType(CreateVitalsDto) {
  @ApiProperty({ example: 'Updated notes', required: false })
  @IsOptional()
  @IsString()
  notes?: string;
}
