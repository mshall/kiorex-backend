import { IsString, IsUUID, IsOptional, IsEnum, IsArray, IsBoolean, IsDateString } from 'class-validator';
import { NoteType, NotePriority } from '../entities/nurse-notes.entity';

export class CreateNurseNotesDto {
  @IsUUID()
  patientId: string;

  @IsUUID()
  nurseId: string;

  @IsString()
  nurseName: string;

  @IsEnum(NoteType)
  noteType: NoteType;

  @IsEnum(NotePriority)
  priority: NotePriority;

  @IsString()
  content: string;

  @IsOptional()
  @IsString()
  summary?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  @IsOptional()
  @IsBoolean()
  requiresFollowUp?: boolean;

  @IsOptional()
  @IsDateString()
  followUpTime?: Date;

  @IsOptional()
  @IsBoolean()
  requiresSupervisorReview?: boolean;

  @IsOptional()
  @IsUUID()
  supervisorId?: string;

  @IsOptional()
  @IsString()
  supervisorName?: string;

  @IsOptional()
  @IsBoolean()
  isConfidential?: boolean;

  @IsOptional()
  @IsBoolean()
  isDraft?: boolean;
}
