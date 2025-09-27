import { IsNotEmpty, IsUUID, IsOptional, IsString, IsEnum, IsDateString, IsArray, IsObject, IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { RecordType } from '../entities/medical-record.entity';

export class CreateMedicalRecordDto {
  @ApiProperty({ description: 'Patient ID' })
  @IsNotEmpty()
  @IsUUID()
  patientId: string;

  @ApiProperty({ description: 'Provider ID' })
  @IsNotEmpty()
  @IsUUID()
  providerId: string;

  @ApiProperty({ description: 'Encounter ID' })
  @IsOptional()
  @IsUUID()
  encounterId?: string;

  @ApiProperty({ description: 'Appointment ID' })
  @IsOptional()
  @IsUUID()
  appointmentId?: string;

  @ApiProperty({ description: 'Record type', enum: RecordType })
  @IsNotEmpty()
  @IsEnum(RecordType)
  recordType: RecordType;

  @ApiProperty({ description: 'Encounter date' })
  @IsNotEmpty()
  @IsDateString()
  encounterDate: Date;

  @ApiProperty({ description: 'Chief complaint' })
  @IsNotEmpty()
  @IsString()
  chiefComplaint: string;

  @ApiProperty({ description: 'History of present illness' })
  @IsNotEmpty()
  @IsString()
  historyOfPresentIllness: string;

  @ApiProperty({ description: 'Review of systems' })
  @IsOptional()
  @IsString()
  reviewOfSystems?: string;

  @ApiProperty({ description: 'Past medical history' })
  @IsOptional()
  @IsObject()
  pastMedicalHistory?: {
    conditions: string[];
    surgeries: string[];
    hospitalizations: string[];
  };

  @ApiProperty({ description: 'Family history' })
  @IsOptional()
  @IsArray()
  familyHistory?: {
    condition: string;
    relationship: string;
  }[];

  @ApiProperty({ description: 'Social history' })
  @IsOptional()
  @IsObject()
  socialHistory?: {
    smoking: string;
    alcohol: string;
    drugs: string;
    occupation: string;
    exercise: string;
    diet: string;
  };

  @ApiProperty({ description: 'Physical examination' })
  @IsNotEmpty()
  @IsString()
  physicalExamination: string;

  @ApiProperty({ description: 'Assessment' })
  @IsNotEmpty()
  @IsString()
  assessment: string;

  @ApiProperty({ description: 'Plan' })
  @IsNotEmpty()
  @IsString()
  plan: string;

  @ApiProperty({ description: 'Education provided' })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  educationProvided?: string[];

  @ApiProperty({ description: 'Follow-up instructions' })
  @IsOptional()
  @IsString()
  followUpInstructions?: string;

  @ApiProperty({ description: 'Attachments' })
  @IsOptional()
  @IsArray()
  attachments?: {
    type: string;
    url: string;
    name: string;
  }[];
}
