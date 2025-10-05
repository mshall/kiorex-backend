import { IsUUID, IsNumber, IsOptional, IsDateString, IsString, Min, Max } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateVitalsDto {
  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440001' })
  @IsUUID()
  patientId: string;

  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440002' })
  @IsUUID()
  medicalRecordId: string;

  @ApiProperty({ example: 98.6, required: false })
  @IsOptional()
  @IsNumber()
  @Min(90)
  @Max(110)
  temperature?: number;

  @ApiProperty({ example: 120, required: false })
  @IsOptional()
  @IsNumber()
  @Min(60)
  @Max(250)
  systolicBP?: number;

  @ApiProperty({ example: 80, required: false })
  @IsOptional()
  @IsNumber()
  @Min(40)
  @Max(150)
  diastolicBP?: number;

  @ApiProperty({ example: 72, required: false })
  @IsOptional()
  @IsNumber()
  @Min(40)
  @Max(200)
  heartRate?: number;

  @ApiProperty({ example: 18, required: false })
  @IsOptional()
  @IsNumber()
  @Min(8)
  @Max(40)
  respiratoryRate?: number;

  @ApiProperty({ example: 98, required: false })
  @IsOptional()
  @IsNumber()
  @Min(70)
  @Max(100)
  oxygenSaturation?: number;

  @ApiProperty({ example: 5.5, required: false })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(20)
  bloodGlucose?: number;

  @ApiProperty({ example: 70, required: false })
  @IsOptional()
  @IsNumber()
  @Min(30)
  @Max(200)
  weight?: number;

  @ApiProperty({ example: 170, required: false })
  @IsOptional()
  @IsNumber()
  @Min(50)
  @Max(250)
  height?: number;

  @ApiProperty({ example: 8, required: false })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(10)
  painLevel?: number;

  @ApiProperty({ example: 'Patient appears stable', required: false })
  @IsOptional()
  @IsString()
  notes?: string;

  @ApiProperty({ example: '2024-01-15T10:30:00Z', required: false })
  @IsOptional()
  @IsDateString()
  recordedAt?: string;
}
