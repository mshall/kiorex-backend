import { IsOptional, IsString, IsArray, IsObject } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateMedicalRecordDto {
  @ApiProperty({ description: 'Chief complaint' })
  @IsOptional()
  @IsString()
  chiefComplaint?: string;

  @ApiProperty({ description: 'History of present illness' })
  @IsOptional()
  @IsString()
  historyOfPresentIllness?: string;

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
  @IsOptional()
  @IsString()
  physicalExamination?: string;

  @ApiProperty({ description: 'Assessment' })
  @IsOptional()
  @IsString()
  assessment?: string;

  @ApiProperty({ description: 'Plan' })
  @IsOptional()
  @IsString()
  plan?: string;

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
