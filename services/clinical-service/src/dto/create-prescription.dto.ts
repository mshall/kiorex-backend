import { IsNotEmpty, IsUUID, IsOptional, IsString, IsEnum, IsNumber, IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { MedicationRoute } from '../entities/prescription.entity';

export class CreatePrescriptionDto {
  @ApiProperty({ description: 'Patient ID' })
  @IsNotEmpty()
  @IsUUID()
  patientId: string;

  @ApiProperty({ description: 'Medical record ID' })
  @IsOptional()
  @IsUUID()
  medicalRecordId?: string;

  @ApiProperty({ description: 'Medication name' })
  @IsNotEmpty()
  @IsString()
  medicationName: string;

  @ApiProperty({ description: 'Generic name' })
  @IsOptional()
  @IsString()
  genericName?: string;

  @ApiProperty({ description: 'NDC code' })
  @IsOptional()
  @IsString()
  ndcCode?: string;

  @ApiProperty({ description: 'RxNorm code' })
  @IsOptional()
  @IsString()
  rxNormCode?: string;

  @ApiProperty({ description: 'Strength' })
  @IsNotEmpty()
  @IsString()
  strength: string;

  @ApiProperty({ description: 'Dosage' })
  @IsNotEmpty()
  @IsString()
  dosage: string;

  @ApiProperty({ description: 'Route', enum: MedicationRoute })
  @IsNotEmpty()
  @IsEnum(MedicationRoute)
  route: MedicationRoute;

  @ApiProperty({ description: 'Frequency' })
  @IsNotEmpty()
  @IsString()
  frequency: string;

  @ApiProperty({ description: 'Duration' })
  @IsNotEmpty()
  @IsString()
  duration: string;

  @ApiProperty({ description: 'Quantity' })
  @IsNotEmpty()
  @IsNumber()
  quantity: number;

  @ApiProperty({ description: 'Number of refills' })
  @IsOptional()
  @IsNumber()
  refills?: number;

  @ApiProperty({ description: 'Substitute allowed' })
  @IsOptional()
  @IsBoolean()
  substituteAllowed?: boolean;

  @ApiProperty({ description: 'Instructions' })
  @IsNotEmpty()
  @IsString()
  instructions: string;

  @ApiProperty({ description: 'Indication' })
  @IsOptional()
  @IsString()
  indication?: string;

  @ApiProperty({ description: 'Pharmacy ID' })
  @IsOptional()
  @IsString()
  pharmacyId?: string;

  @ApiProperty({ description: 'Pharmacy name' })
  @IsOptional()
  @IsString()
  pharmacyName?: string;

  @ApiProperty({ description: 'Is controlled substance' })
  @IsOptional()
  @IsBoolean()
  isControlled?: boolean;

  @ApiProperty({ description: 'DEA schedule' })
  @IsOptional()
  @IsString()
  deaSchedule?: string;

  @ApiProperty({ description: 'Prior authorization required' })
  @IsOptional()
  @IsBoolean()
  priorAuthRequired?: boolean;
}
