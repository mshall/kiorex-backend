import { IsString, IsUUID, IsOptional, IsEnum, IsDateString, IsNumber, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ShiftType } from '../entities/nurse-shift.entity';

export class CreateNurseShiftDto {
  @IsUUID()
  nurseId: string;

  @IsString()
  nurseName: string;

  @IsDateString()
  shiftDate: Date;

  @IsEnum(ShiftType)
  type: ShiftType;

  @IsString()
  startTime: string;

  @IsString()
  endTime: string;

  @IsOptional()
  @IsString()
  unit?: string;

  @IsOptional()
  @IsString()
  floor?: string;

  @IsOptional()
  @IsString()
  ward?: string;

  @IsOptional()
  @IsNumber()
  patientCount?: number;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  assignedPatients?: string[];

  @IsOptional()
  @IsUUID()
  supervisorId?: string;

  @IsOptional()
  @IsString()
  supervisorName?: string;
}
