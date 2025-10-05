import { IsString, IsNumber, IsOptional, IsEnum, IsArray, IsBoolean, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export enum TestCategory {
  BLOOD_TEST = 'blood_test',
  URINE_TEST = 'urine_test',
  STOOL_TEST = 'stool_test',
  IMAGING = 'imaging',
  CARDIAC = 'cardiac',
  DIABETES = 'diabetes',
  THYROID = 'thyroid',
  LIVER = 'liver',
  KIDNEY = 'kidney',
  VITAMIN = 'vitamin',
  HORMONE = 'hormone',
  INFECTIOUS_DISEASE = 'infectious_disease',
  CANCER_SCREENING = 'cancer_screening',
}

export enum TestType {
  SINGLE = 'single',
  PACKAGE = 'package',
  PROFILE = 'profile',
}

export class CreateLabTestDto {
  @ApiProperty({ example: 'Complete Blood Count (CBC)' })
  @IsString()
  name: string;

  @ApiProperty({ example: 'A complete blood count test to measure different components of blood' })
  @IsString()
  description: string;

  @ApiProperty({ enum: TestCategory, example: TestCategory.BLOOD_TEST })
  @IsEnum(TestCategory)
  category: TestCategory;

  @ApiProperty({ enum: TestType, example: TestType.SINGLE })
  @IsEnum(TestType)
  type: TestType;

  @ApiProperty({ example: 150.00 })
  @IsNumber()
  @Min(0)
  price: number;

  @ApiProperty({ example: 2 })
  @IsNumber()
  @Min(0)
  duration: number; // in hours

  @ApiProperty({ example: 'Fasting required for 8-12 hours', required: false })
  @IsOptional()
  @IsString()
  preparation?: string;

  @ApiProperty({ example: 'Blood sample collection', required: false })
  @IsOptional()
  @IsString()
  sampleType?: string;

  @ApiProperty({ example: 'Normal range: 4.5-5.5 million cells/mcL', required: false })
  @IsOptional()
  @IsString()
  normalRange?: string;

  @ApiProperty({ example: ['RBC', 'WBC', 'Hemoglobin', 'Platelets'], required: false })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  parameters?: string[];

  @ApiProperty({ example: true, required: false })
  @IsOptional()
  @IsBoolean()
  homeCollectionAvailable?: boolean;

  @ApiProperty({ example: true, required: false })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiProperty({ example: 'https://example.com/test-image.jpg', required: false })
  @IsOptional()
  @IsString()
  imageUrl?: string;
}
