import { IsNotEmpty, IsUUID, IsOptional, IsString, IsArray, IsEnum, IsNumber, IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { ConsultationType } from '../entities/appointment.entity';

export class CreateAppointmentDto {
  @ApiProperty({ description: 'Patient ID' })
  @IsNotEmpty()
  @IsUUID()
  patientId: string;

  @ApiProperty({ description: 'Provider ID' })
  @IsNotEmpty()
  @IsUUID()
  providerId: string;

  @ApiProperty({ description: 'Appointment slot ID' })
  @IsNotEmpty()
  @IsUUID()
  slotId: string;

  @ApiProperty({ description: 'Appointment type ID' })
  @IsNotEmpty()
  @IsUUID()
  appointmentTypeId: string;

  @ApiProperty({ description: 'Consultation type', enum: ConsultationType })
  @IsOptional()
  @IsEnum(ConsultationType)
  consultationType?: ConsultationType;

  @ApiProperty({ description: 'Reason for visit' })
  @IsOptional()
  @IsString()
  reasonForVisit?: string;

  @ApiProperty({ description: 'Symptoms', type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  symptoms?: string[];

  @ApiProperty({ description: 'Chief complaint' })
  @IsOptional()
  @IsString()
  chiefComplaint?: string;

  @ApiProperty({ description: 'Consultation fee' })
  @IsOptional()
  @IsNumber()
  consultationFee?: number;

  @ApiProperty({ description: 'Follow up required' })
  @IsOptional()
  @IsBoolean()
  followUpRequired?: boolean;

  @ApiProperty({ description: 'Metadata' })
  @IsOptional()
  metadata?: Record<string, any>;
}
