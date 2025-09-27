import { IsNotEmpty, IsUUID, IsDateString, IsOptional, IsArray, IsString, IsNumber, IsBoolean, IsObject } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateSlotDto {
  @ApiProperty({ description: 'Provider ID' })
  @IsNotEmpty()
  @IsUUID()
  providerId: string;

  @ApiProperty({ description: 'Start time' })
  @IsNotEmpty()
  @IsDateString()
  startTime: Date;

  @ApiProperty({ description: 'End time' })
  @IsNotEmpty()
  @IsDateString()
  endTime: Date;

  @ApiProperty({ description: 'Allowed appointment types', type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  allowedAppointmentTypes?: string[];

  @ApiProperty({ description: 'Maximum bookings' })
  @IsOptional()
  @IsNumber()
  maxBookings?: number;

  @ApiProperty({ description: 'Location ID' })
  @IsOptional()
  @IsString()
  locationId?: string;

  @ApiProperty({ description: 'Room number' })
  @IsOptional()
  @IsString()
  roomNumber?: string;

  @ApiProperty({ description: 'Notes' })
  @IsOptional()
  @IsString()
  notes?: string;

  @ApiProperty({ description: 'Is overbook allowed' })
  @IsOptional()
  @IsBoolean()
  isOverbook?: boolean;

  @ApiProperty({ description: 'Recurring pattern ID' })
  @IsOptional()
  @IsString()
  recurringPatternId?: string;
}

export class BulkCreateSlotsDto {
  @ApiProperty({ description: 'Provider ID' })
  @IsNotEmpty()
  @IsUUID()
  providerId: string;

  @ApiProperty({ description: 'Start date' })
  @IsNotEmpty()
  @IsDateString()
  startDate: Date;

  @ApiProperty({ description: 'End date' })
  @IsNotEmpty()
  @IsDateString()
  endDate: Date;

  @ApiProperty({ description: 'Working hours' })
  @IsNotEmpty()
  @IsObject()
  workingHours: {
    [key: string]: {
      isOff: boolean;
      morning?: { start: string; end: string };
      afternoon?: { start: string; end: string };
    };
  };

  @ApiProperty({ description: 'Slot duration in minutes' })
  @IsNotEmpty()
  @IsNumber()
  slotDuration: number;

  @ApiProperty({ description: 'Break time in minutes' })
  @IsOptional()
  @IsNumber()
  breakTime?: number;

  @ApiProperty({ description: 'Excluded dates', type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  excludeDates?: string[];

  @ApiProperty({ description: 'Allowed appointment types', type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  allowedAppointmentTypes?: string[];

  @ApiProperty({ description: 'Location ID' })
  @IsOptional()
  @IsString()
  locationId?: string;

  @ApiProperty({ description: 'Room number' })
  @IsOptional()
  @IsString()
  roomNumber?: string;
}
