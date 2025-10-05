import { TeamMemberRole } from '../entities/surgery-team.entity';
export declare class TeamMemberDto {
    memberId: string;
    memberName: string;
    role: TeamMemberRole;
    specialty?: string;
    licenseNumber?: string;
    contactInfo?: string;
    notes?: string;
}
export declare class CreateSurgeryTeamDto {
    surgeryId: string;
    teamMembers: TeamMemberDto[];
    assignedBy?: string;
}
