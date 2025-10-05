import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SurgeryTeam, TeamMemberRole } from '../entities/surgery-team.entity';
import { CreateSurgeryTeamDto } from '../dto/create-surgery-team.dto';

@Injectable()
export class SurgeryTeamService {
  constructor(
    @InjectRepository(SurgeryTeam)
    private surgeryTeamRepository: Repository<SurgeryTeam>,
  ) {}

  async createSurgeryTeam(createDto: CreateSurgeryTeamDto, userId: string): Promise<SurgeryTeam[]> {
    const teamMembers = createDto.teamMembers.map(member => 
      this.surgeryTeamRepository.create({
        ...member,
        surgeryId: createDto.surgeryId,
        assignedBy: createDto.assignedBy || userId,
        assignedAt: new Date(),
      })
    );

    return await this.surgeryTeamRepository.save(teamMembers);
  }

  async getSurgeryTeam(surgeryId: string): Promise<SurgeryTeam[]> {
    return await this.surgeryTeamRepository.find({
      where: { surgeryId, isActive: true },
      order: { role: 'ASC' },
    });
  }

  async getTeamMember(id: string): Promise<SurgeryTeam> {
    const teamMember = await this.surgeryTeamRepository.findOne({
      where: { id },
    });

    if (!teamMember) {
      throw new NotFoundException('Team member not found');
    }

    return teamMember;
  }

  async updateTeamMember(
    id: string,
    updateDto: any,
    userId: string,
    userRole: string,
  ): Promise<SurgeryTeam> {
    const teamMember = await this.getTeamMember(id);

    // Only surgeons and admin can update team members
    if (!['surgeon', 'admin'].includes(userRole)) {
      throw new ForbiddenException('Insufficient permissions to update team member');
    }

    Object.assign(teamMember, updateDto);
    return await this.surgeryTeamRepository.save(teamMember);
  }

  async confirmTeamMember(id: string, userId: string, userRole: string): Promise<SurgeryTeam> {
    const teamMember = await this.getTeamMember(id);

    // Only the team member themselves can confirm
    if (teamMember.memberId !== userId) {
      throw new ForbiddenException('Only the assigned team member can confirm');
    }

    teamMember.confirmedAt = new Date();
    return await this.surgeryTeamRepository.save(teamMember);
  }

  async declineTeamMember(
    id: string,
    declineReason: string,
    userId: string,
    userRole: string,
  ): Promise<SurgeryTeam> {
    const teamMember = await this.getTeamMember(id);

    // Only the team member themselves can decline
    if (teamMember.memberId !== userId) {
      throw new ForbiddenException('Only the assigned team member can decline');
    }

    teamMember.declinedAt = new Date();
    teamMember.declineReason = declineReason;
    teamMember.isActive = false;

    return await this.surgeryTeamRepository.save(teamMember);
  }

  async removeTeamMember(id: string, userId: string, userRole: string): Promise<void> {
    const teamMember = await this.getTeamMember(id);

    // Only surgeons and admin can remove team members
    if (!['surgeon', 'admin'].includes(userRole)) {
      throw new ForbiddenException('Insufficient permissions to remove team member');
    }

    teamMember.isActive = false;
    await this.surgeryTeamRepository.save(teamMember);
  }

  async getTeamMembersByRole(role: TeamMemberRole): Promise<SurgeryTeam[]> {
    return await this.surgeryTeamRepository.find({
      where: { role, isActive: true },
      order: { createdAt: 'DESC' },
    });
  }

  async getTeamMembersBySurgery(surgeryId: string): Promise<SurgeryTeam[]> {
    return await this.surgeryTeamRepository.find({
      where: { surgeryId, isActive: true },
      order: { role: 'ASC' },
    });
  }

  async getTeamMembersByMember(memberId: string): Promise<SurgeryTeam[]> {
    return await this.surgeryTeamRepository.find({
      where: { memberId, isActive: true },
      order: { createdAt: 'DESC' },
    });
  }

  async getPendingConfirmations(memberId: string): Promise<SurgeryTeam[]> {
    return await this.surgeryTeamRepository.find({
      where: { 
        memberId, 
        isActive: true,
        confirmedAt: null,
        declinedAt: null,
      },
      order: { assignedAt: 'ASC' },
    });
  }

  async getTeamStatistics(): Promise<any> {
    const total = await this.surgeryTeamRepository.count();
    const active = await this.surgeryTeamRepository.count({ where: { isActive: true } });
    const confirmed = await this.surgeryTeamRepository
      .createQueryBuilder('team')
      .where('team.confirmedAt IS NOT NULL')
      .andWhere('team.isActive = :isActive', { isActive: true })
      .getCount();
    const declined = await this.surgeryTeamRepository
      .createQueryBuilder('team')
      .where('team.declinedAt IS NOT NULL')
      .getCount();

    const roleStats = await this.surgeryTeamRepository
      .createQueryBuilder('team')
      .select('team.role', 'role')
      .addSelect('COUNT(*)', 'count')
      .where('team.isActive = :isActive', { isActive: true })
      .groupBy('team.role')
      .getRawMany();

    return {
      total,
      active,
      confirmed,
      declined,
      confirmationRate: total > 0 ? (confirmed / total) * 100 : 0,
      roleStats,
    };
  }

  async getAvailableTeamMembers(
    role: TeamMemberRole,
    startDate: Date,
    endDate: Date,
  ): Promise<any[]> {
    // This would typically check against team member schedules
    // For now, return a mock response
    return [];
  }

  async getTeamMemberWorkload(memberId: string, startDate: Date, endDate: Date): Promise<any> {
    const assignments = await this.surgeryTeamRepository
      .createQueryBuilder('team')
      .leftJoin('team.surgery', 'surgery')
      .where('team.memberId = :memberId', { memberId })
      .andWhere('team.isActive = :isActive', { isActive: true })
      .andWhere('surgery.scheduledDate BETWEEN :startDate AND :endDate', {
        startDate,
        endDate,
      })
      .getMany();

    return {
      memberId,
      totalAssignments: assignments.length,
      confirmed: assignments.filter(a => a.confirmedAt).length,
      declined: assignments.filter(a => a.declinedAt).length,
      pending: assignments.filter(a => !a.confirmedAt && !a.declinedAt).length,
    };
  }
}
