import { IsNotEmpty, IsUUID, IsOptional, IsString, IsEnum, IsObject, IsBoolean, IsArray } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { NoteType } from '../entities/clinical-note.entity';

export class CreateClinicalNoteDto {
  @ApiProperty({ description: 'Patient ID' })
  @IsNotEmpty()
  @IsUUID()
  patientId: string;

  @ApiProperty({ description: 'Medical record ID' })
  @IsOptional()
  @IsUUID()
  medicalRecordId?: string;

  @ApiProperty({ description: 'Note type', enum: NoteType })
  @IsNotEmpty()
  @IsEnum(NoteType)
  noteType: NoteType;

  @ApiProperty({ description: 'Content' })
  @IsNotEmpty()
  @IsString()
  content: string;

  @ApiProperty({ description: 'Subjective (for SOAP notes)' })
  @IsOptional()
  @IsString()
  subjective?: string;

  @ApiProperty({ description: 'Objective (for SOAP notes)' })
  @IsOptional()
  @IsString()
  objective?: string;

  @ApiProperty({ description: 'Assessment (for SOAP notes)' })
  @IsOptional()
  @IsString()
  assessment?: string;

  @ApiProperty({ description: 'Plan (for SOAP notes)' })
  @IsOptional()
  @IsString()
  plan?: string;

  @ApiProperty({ description: 'Vital signs' })
  @IsOptional()
  @IsObject()
  vitalSigns?: {
    bloodPressure?: string;
    heartRate?: number;
    temperature?: number;
    respiratoryRate?: number;
    oxygenSaturation?: number;
    weight?: number;
    height?: number;
    bmi?: number;
  };

  @ApiProperty({ description: 'Attachments' })
  @IsOptional()
  @IsArray()
  attachments?: {
    type: string;
    url: string;
    name: string;
  }[];

  @ApiProperty({ description: 'Is draft' })
  @IsOptional()
  @IsBoolean()
  isDraft?: boolean;
}
