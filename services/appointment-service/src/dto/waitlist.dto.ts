import { IsNotEmpty, IsUUID, IsDateString, IsOptional, IsArray, IsString, IsNumber, IsObject } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateWaitlistDto {
  @ApiProperty({ description: 'Patient ID' })
  @IsNotEmpty()
  @IsUUID()
  patientId: string;

  @ApiProperty({ description: 'Provider ID' })
  @IsNotEmpty()
  @IsUUID()
  providerId: string;

  @ApiProperty({ description: 'Appointment type ID' })
  @IsOptional()
  @IsUUID()
  appointmentTypeId?: string;

  @ApiProperty({ description: 'Preferred date' })
  @IsNotEmpty()
  @IsDateString()
  preferredDate: Date;

  @ApiProperty({ description: 'Preferred time slots' })
  @IsOptional()
  @IsArray()
  @IsObject({ each: true })
  preferredTimeSlots?: {
    start: string;
    end: string;
  }[];

  @ApiProperty({ description: 'Priority' })
  @IsOptional()
  @IsNumber()
  priority?: number;

  @ApiProperty({ description: 'Notes' })
  @IsOptional()
  @IsString()
  notes?: string;
}

export class OfferWaitlistDto {
  @ApiProperty({ description: 'Slot ID to offer' })
  @IsNotEmpty()
  @IsUUID()
  slotId: string;

  @ApiProperty({ description: 'Offer expires at' })
  @IsOptional()
  @IsDateString()
  expiresAt?: Date;
}
