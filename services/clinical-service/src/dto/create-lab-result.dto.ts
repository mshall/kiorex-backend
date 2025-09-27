import { IsNotEmpty, IsUUID, IsOptional, IsString, IsEnum, IsDateString, IsArray, IsObject, IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { LabPriority } from '../entities/lab-result.entity';

export class CreateLabResultDto {
  @ApiProperty({ description: 'Patient ID' })
  @IsNotEmpty()
  @IsUUID()
  patientId: string;

  @ApiProperty({ description: 'Medical record ID' })
  @IsOptional()
  @IsUUID()
  medicalRecordId?: string;

  @ApiProperty({ description: 'Test name' })
  @IsNotEmpty()
  @IsString()
  testName: string;

  @ApiProperty({ description: 'LOINC code' })
  @IsOptional()
  @IsString()
  loincCode?: string;

  @ApiProperty({ description: 'Category' })
  @IsOptional()
  @IsString()
  category?: string;

  @ApiProperty({ description: 'Test date' })
  @IsNotEmpty()
  @IsDateString()
  testDate: Date;

  @ApiProperty({ description: 'Result date' })
  @IsOptional()
  @IsDateString()
  resultDate?: Date;

  @ApiProperty({ description: 'Priority', enum: LabPriority })
  @IsOptional()
  @IsEnum(LabPriority)
  priority?: LabPriority;

  @ApiProperty({ description: 'Results' })
  @IsNotEmpty()
  @IsArray()
  @IsObject({ each: true })
  results: {
    component: string;
    value: string;
    unit: string;
    referenceRange: string;
    flag: string;
    notes?: string;
  }[];

  @ApiProperty({ description: 'Interpretation' })
  @IsOptional()
  @IsString()
  interpretation?: string;

  @ApiProperty({ description: 'Clinical significance' })
  @IsOptional()
  @IsString()
  clinicalSignificance?: string;

  @ApiProperty({ description: 'Performing lab' })
  @IsOptional()
  @IsString()
  performingLab?: string;

  @ApiProperty({ description: 'Pathologist ID' })
  @IsOptional()
  @IsString()
  pathologistId?: string;

  @ApiProperty({ description: 'Specimen type' })
  @IsOptional()
  @IsString()
  specimenType?: string;

  @ApiProperty({ description: 'Specimen collected at' })
  @IsOptional()
  @IsDateString()
  specimenCollectedAt?: Date;

  @ApiProperty({ description: 'Attachments' })
  @IsOptional()
  @IsArray()
  attachments?: {
    type: string;
    url: string;
    name: string;
  }[];

  @ApiProperty({ description: 'Critical value' })
  @IsOptional()
  @IsBoolean()
  criticalValue?: boolean;
}
