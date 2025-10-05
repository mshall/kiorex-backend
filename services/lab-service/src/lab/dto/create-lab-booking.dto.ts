import { IsUUID, IsDateString, IsString, IsOptional, IsEnum, IsNumber, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export enum BookingStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
  NO_SHOW = 'no_show',
}

export enum CollectionType {
  LAB_VISIT = 'lab_visit',
  HOME_COLLECTION = 'home_collection',
}

export class CreateLabBookingDto {
  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440001' })
  @IsUUID()
  testId: string;

  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440002' })
  @IsUUID()
  labId: string;

  @ApiProperty({ example: '2024-01-15T10:00:00Z' })
  @IsDateString()
  scheduledDateTime: string;

  @ApiProperty({ enum: CollectionType, example: CollectionType.LAB_VISIT })
  @IsEnum(CollectionType)
  collectionType: CollectionType;

  @ApiProperty({ example: '123 Main St, City, State', required: false })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiProperty({ example: '+1234567890', required: false })
  @IsOptional()
  @IsString()
  contactPhone?: string;

  @ApiProperty({ example: 'Morning (8AM-12PM)', required: false })
  @IsOptional()
  @IsString()
  preferredTimeSlot?: string;

  @ApiProperty({ example: 'Patient has diabetes, please note', required: false })
  @IsOptional()
  @IsString()
  notes?: string;

  @ApiProperty({ example: 1, required: false })
  @IsOptional()
  @IsNumber()
  @Min(1)
  quantity?: number;

  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440003', required: false })
  @IsOptional()
  @IsUUID()
  appointmentId?: string; // If booked during consultation
}
