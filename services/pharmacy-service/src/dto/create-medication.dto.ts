import { IsString, IsOptional, IsBoolean, IsNumber, IsArray, IsDateString, IsEnum } from 'class-validator';

export class CreateMedicationDto {
  @IsString()
  name: string;

  @IsString()
  genericName: string;

  @IsString()
  category: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  manufacturer?: string;

  @IsOptional()
  @IsString()
  dosageForm?: string;

  @IsOptional()
  @IsString()
  strength?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  activeIngredients?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  sideEffects?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  contraindications?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  drugInteractions?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  storageInstructions?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  administrationInstructions?: string[];

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @IsOptional()
  @IsBoolean()
  requiresPrescription?: boolean;

  @IsOptional()
  @IsNumber()
  unitPrice?: number;

  @IsOptional()
  @IsString()
  unit?: string;

  @IsOptional()
  @IsString()
  ndc?: string;

  @IsOptional()
  @IsString()
  upc?: string;

  @IsOptional()
  @IsString()
  barcode?: string;

  @IsOptional()
  @IsNumber()
  stockQuantity?: number;

  @IsOptional()
  @IsNumber()
  minimumStockLevel?: number;

  @IsOptional()
  @IsNumber()
  maximumStockLevel?: number;

  @IsOptional()
  @IsDateString()
  expiryDate?: Date;

  @IsOptional()
  @IsString()
  batchNumber?: string;

  @IsOptional()
  @IsString()
  supplier?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  images?: string[];
}
