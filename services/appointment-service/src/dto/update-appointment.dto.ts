import { IsOptional, IsString, IsArray, IsEnum, IsNumber, IsBoolean, IsObject } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { AppointmentStatus } from '../entities/appointment.entity';

export class UpdateAppointmentDto {
  @ApiProperty({ description: 'Appointment status', enum: AppointmentStatus })
  @IsOptional()
  @IsEnum(AppointmentStatus)
  status?: AppointmentStatus;

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

  @ApiProperty({ description: 'Vitals' })
  @IsOptional()
  @IsObject()
  vitals?: {
    bloodPressure?: string;
    heartRate?: number;
    temperature?: number;
    weight?: number;
    height?: number;
  };

  @ApiProperty({ description: 'Notes' })
  @IsOptional()
  @IsString()
  notes?: string;

  @ApiProperty({ description: 'Private notes' })
  @IsOptional()
  @IsString()
  privateNotes?: string;

  @ApiProperty({ description: 'Consultation fee' })
  @IsOptional()
  @IsNumber()
  consultationFee?: number;

  @ApiProperty({ description: 'Is paid' })
  @IsOptional()
  @IsBoolean()
  isPaid?: boolean;

  @ApiProperty({ description: 'Payment ID' })
  @IsOptional()
  @IsString()
  paymentId?: string;

  @ApiProperty({ description: 'Insurance claim ID' })
  @IsOptional()
  @IsString()
  insuranceClaimId?: string;

  @ApiProperty({ description: 'Follow up required' })
  @IsOptional()
  @IsBoolean()
  followUpRequired?: boolean;

  @ApiProperty({ description: 'Follow up appointment ID' })
  @IsOptional()
  @IsString()
  followUpAppointmentId?: string;

  @ApiProperty({ description: 'Metadata' })
  @IsOptional()
  @IsObject()
  metadata?: Record<string, any>;
}
