import { IsString, IsOptional, IsNumber, IsEnum, IsBoolean, IsArray } from 'class-validator';

export enum LabTestCategory {
  HEMATOLOGY = 'hematology',
  CHEMISTRY = 'chemistry',
  MICROBIOLOGY = 'microbiology',
  IMMUNOLOGY = 'immunology',
  PATHOLOGY = 'pathology',
  MOLECULAR = 'molecular',
  TOXICOLOGY = 'toxicology',
  ENDOCRINOLOGY = 'endocrinology',
}

export enum LabTestType {
  BLOOD = 'blood',
  URINE = 'urine',
  STOOL = 'stool',
  SPUTUM = 'sputum',
  TISSUE = 'tissue',
  SWAB = 'swab',
  FLUID = 'fluid',
}

export class CreateLabTestDto {
  @IsString()
  testCode: string;

  @IsString()
  testName: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsEnum(LabTestCategory)
  category: LabTestCategory;

  @IsEnum(LabTestType)
  specimenType: LabTestType;

  @IsOptional()
  @IsString()
  methodology?: string;

  @IsOptional()
  @IsString()
  referenceRange?: string;

  @IsOptional()
  @IsNumber()
  turnaroundTime?: number; // in hours

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @IsOptional()
  @IsString()
  instructions?: string;

  @IsOptional()
  @IsString()
  preparation?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  relatedTests?: string[];

  @IsOptional()
  @IsNumber()
  cost?: number;
}
