import { IsString, IsEmail, IsOptional, IsPhoneNumber, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export enum SupplierStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  SUSPENDED = 'suspended',
}

export class CreateSupplierDto {
  @ApiProperty({ example: 'MedSupply Inc.' })
  @IsString()
  name: string;

  @ApiProperty({ example: 'Medical supplies and equipment supplier' })
  @IsString()
  description: string;

  @ApiProperty({ example: 'contact@medsupply.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: '+1234567890' })
  @IsPhoneNumber()
  phone: string;

  @ApiProperty({ example: '123 Business St, City, State 12345' })
  @IsString()
  address: string;

  @ApiProperty({ example: 'John Smith', required: false })
  @IsOptional()
  @IsString()
  contactPerson?: string;

  @ApiProperty({ example: '+1234567891', required: false })
  @IsOptional()
  @IsPhoneNumber()
  contactPhone?: string;

  @ApiProperty({ example: 'john@medsupply.com', required: false })
  @IsOptional()
  @IsEmail()
  contactEmail?: string;

  @ApiProperty({ example: 'www.medsupply.com', required: false })
  @IsOptional()
  @IsString()
  website?: string;

  @ApiProperty({ example: 'NET30', required: false })
  @IsOptional()
  @IsString()
  paymentTerms?: string;

  @ApiProperty({ example: 'ABC123456', required: false })
  @IsOptional()
  @IsString()
  taxId?: string;

  @ApiProperty({ example: 'Licensed medical supplier', required: false })
  @IsOptional()
  @IsString()
  certifications?: string;

  @ApiProperty({ enum: SupplierStatus, example: SupplierStatus.ACTIVE, required: false })
  @IsOptional()
  @IsEnum(SupplierStatus)
  status?: SupplierStatus;
}
