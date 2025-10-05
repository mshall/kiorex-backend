import { Repository } from 'typeorm';
import { SurgeryTeam, TeamMemberRole } from '../entities/surgery-team.entity';
import { CreateSurgeryTeamDto } from '../dto/create-surgery-team.dto';
export declare class SurgeryTeamService {
    private surgeryTeamRepository;
    constructor(surgeryTeamRepository: Repository<SurgeryTeam>);
    createSurgeryTeam(createDto: CreateSurgeryTeamDto, userId: string): Promise<SurgeryTeam[]>;
    getSurgeryTeam(surgeryId: string): Promise<SurgeryTeam[]>;
    getTeamMember(id: string): Promise<SurgeryTeam>;
    updateTeamMember(id: string, updateDto: any, userId: string, userRole: string): Promise<SurgeryTeam>;
    confirmTeamMember(id: string, userId: string, userRole: string): Promise<SurgeryTeam>;
    declineTeamMember(id: string, declineReason: string, userId: string, userRole: string): Promise<SurgeryTeam>;
    removeTeamMember(id: string, userId: string, userRole: string): Promise<void>;
    getTeamMembersByRole(role: TeamMemberRole): Promise<SurgeryTeam[]>;
    getTeamMembersBySurgery(surgeryId: string): Promise<SurgeryTeam[]>;
    getTeamMembersByMember(memberId: string): Promise<SurgeryTeam[]>;
    getPendingConfirmations(memberId: string): Promise<SurgeryTeam[]>;
    getTeamStatistics(): Promise<any>;
    getAvailableTeamMembers(role: TeamMemberRole, startDate: Date, endDate: Date): Promise<any[]>;
    getTeamMemberWorkload(memberId: string, startDate: Date, endDate: Date): Promise<any>;
}
