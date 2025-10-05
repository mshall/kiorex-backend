import { IsString, IsUUID, IsOptional, IsEnum, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { TeamMemberRole } from '../entities/surgery-team.entity';

export class TeamMemberDto {
  @IsUUID()
  memberId: string;

  @IsString()
  memberName: string;

  @IsEnum(TeamMemberRole)
  role: TeamMemberRole;

  @IsOptional()
  @IsString()
  specialty?: string;

  @IsOptional()
  @IsString()
  licenseNumber?: string;

  @IsOptional()
  @IsString()
  contactInfo?: string;

  @IsOptional()
  @IsString()
  notes?: string;
}

export class CreateSurgeryTeamDto {
  @IsUUID()
  surgeryId: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TeamMemberDto)
  teamMembers: TeamMemberDto[];

  @IsOptional()
  @IsString()
  assignedBy?: string;
}
