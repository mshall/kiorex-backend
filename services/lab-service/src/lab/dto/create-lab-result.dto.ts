import { IsUUID, IsString, IsOptional, IsEnum, IsNumber, IsDateString, IsArray, IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export enum ResultStatus {
  PENDING = 'pending',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  ABNORMAL = 'abnormal',
  CRITICAL = 'critical',
}

export enum SeverityLevel {
  NORMAL = 'normal',
  MILD = 'mild',
  MODERATE = 'moderate',
  SEVERE = 'severe',
  CRITICAL = 'critical',
}

export class LabParameter {
  @ApiProperty({ example: 'Hemoglobin' })
  @IsString()
  name: string;

  @ApiProperty({ example: '12.5' })
  @IsString()
  value: string;

  @ApiProperty({ example: 'g/dL' })
  @IsString()
  unit: string;

  @ApiProperty({ example: '11.5-15.5' })
  @IsString()
  normalRange: string;

  @ApiProperty({ enum: SeverityLevel, example: SeverityLevel.NORMAL })
  @IsEnum(SeverityLevel)
  severity: SeverityLevel;

  @ApiProperty({ example: 'Within normal range', required: false })
  @IsOptional()
  @IsString()
  interpretation?: string;
}

export class CreateLabResultDto {
  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440001' })
  @IsUUID()
  bookingId: string;

  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440002' })
  @IsUUID()
  testId: string;

  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440003' })
  @IsUUID()
  patientId: string;

  @ApiProperty({ example: '2024-01-15T14:30:00Z' })
  @IsDateString()
  testDate: string;

  @ApiProperty({ example: '2024-01-16T10:00:00Z' })
  @IsDateString()
  resultDate: string;

  @ApiProperty({ enum: ResultStatus, example: ResultStatus.COMPLETED })
  @IsEnum(ResultStatus)
  status: ResultStatus;

  @ApiProperty({ type: [LabParameter] })
  @IsArray()
  parameters: LabParameter[];

  @ApiProperty({ example: 'All parameters within normal range', required: false })
  @IsOptional()
  @IsString()
  summary?: string;

  @ApiProperty({ example: 'Continue current medication', required: false })
  @IsOptional()
  @IsString()
  recommendations?: string;

  @ApiProperty({ example: 'Dr. Smith', required: false })
  @IsOptional()
  @IsString()
  reviewedBy?: string;

  @ApiProperty({ example: 'https://example.com/result-pdf.pdf', required: false })
  @IsOptional()
  @IsString()
  pdfUrl?: string;

  @ApiProperty({ example: true, required: false })
  @IsOptional()
  @IsBoolean()
  isAbnormal?: boolean;

  @ApiProperty({ example: 'Patient should consult doctor for elevated cholesterol', required: false })
  @IsOptional()
  @IsString()
  abnormalNotes?: string;
}
