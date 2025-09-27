import { IsNotEmpty, IsUUID, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RescheduleAppointmentDto {
  @ApiProperty({ description: 'New appointment slot ID' })
  @IsNotEmpty()
  @IsUUID()
  newSlotId: string;

  @ApiProperty({ description: 'Reason for rescheduling' })
  @IsOptional()
  @IsString()
  reason?: string;
}
