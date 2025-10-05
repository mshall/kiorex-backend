import { SurgeryTeamService } from '../services/surgery-team.service';
import { CreateSurgeryTeamDto } from '../dto/create-surgery-team.dto';
import { TeamMemberRole } from '../entities/surgery-team.entity';
export declare class SurgeryTeamController {
    private readonly surgeryTeamService;
    constructor(surgeryTeamService: SurgeryTeamService);
    create(createDto: CreateSurgeryTeamDto, user: any): Promise<import("../entities/surgery-team.entity").SurgeryTeam[]>;
    getSurgeryTeam(surgeryId: string): Promise<import("../entities/surgery-team.entity").SurgeryTeam[]>;
    findOne(id: string): Promise<import("../entities/surgery-team.entity").SurgeryTeam>;
    update(id: string, updateDto: any, user: any): Promise<import("../entities/surgery-team.entity").SurgeryTeam>;
    confirm(id: string, user: any): Promise<import("../entities/surgery-team.entity").SurgeryTeam>;
    decline(id: string, declineReason: string, user: any): Promise<import("../entities/surgery-team.entity").SurgeryTeam>;
    remove(id: string, user: any): Promise<{
        message: string;
    }>;
    getByRole(role: TeamMemberRole): Promise<import("../entities/surgery-team.entity").SurgeryTeam[]>;
    getByMember(memberId: string): Promise<import("../entities/surgery-team.entity").SurgeryTeam[]>;
    getPendingConfirmations(memberId: string): Promise<import("../entities/surgery-team.entity").SurgeryTeam[]>;
    getStatistics(user: any): Promise<any>;
    getWorkload(memberId: string, startDate: Date, endDate: Date): Promise<any>;
    getAvailableTeamMembers(role: TeamMemberRole, startDate: Date, endDate: Date, user: any): Promise<any[]>;
}
