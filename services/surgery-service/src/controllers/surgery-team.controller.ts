import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  ParseUUIDPipe,
  ValidationPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { RolesGuard } from '../guards/roles.guard';
import { Roles } from '../decorators/roles.decorator';
import { CurrentUser } from '../decorators/current-user.decorator';
import { SurgeryTeamService } from '../services/surgery-team.service';
import { CreateSurgeryTeamDto } from '../dto/create-surgery-team.dto';
import { TeamMemberRole } from '../entities/surgery-team.entity';

@ApiTags('Surgery Teams')
@Controller('surgery-teams')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class SurgeryTeamController {
  constructor(private readonly surgeryTeamService: SurgeryTeamService) {}

  @Post()
  @Roles('surgeon', 'admin')
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: 'Create surgery team' })
  @ApiResponse({ status: 201, description: 'Surgery team created successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  async create(
    @Body(ValidationPipe) createDto: CreateSurgeryTeamDto,
    @CurrentUser() user: any,
  ) {
    return await this.surgeryTeamService.createSurgeryTeam(createDto, user.userId);
  }

  @Get('surgery/:surgeryId')
  @ApiOperation({ summary: 'Get surgery team' })
  @ApiResponse({ status: 200, description: 'Surgery team retrieved successfully' })
  async getSurgeryTeam(@Param('surgeryId', ParseUUIDPipe) surgeryId: string) {
    return await this.surgeryTeamService.getSurgeryTeam(surgeryId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get team member by ID' })
  @ApiResponse({ status: 200, description: 'Team member retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Team member not found' })
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    return await this.surgeryTeamService.getTeamMember(id);
  }

  @Put(':id')
  @Roles('surgeon', 'admin')
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: 'Update team member' })
  @ApiResponse({ status: 200, description: 'Team member updated successfully' })
  @ApiResponse({ status: 404, description: 'Team member not found' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body(ValidationPipe) updateDto: any,
    @CurrentUser() user: any,
  ) {
    return await this.surgeryTeamService.updateTeamMember(id, updateDto, user.userId, user.role);
  }

  @Put(':id/confirm')
  @ApiOperation({ summary: 'Confirm team member assignment' })
  @ApiResponse({ status: 200, description: 'Team member confirmed successfully' })
  @ApiResponse({ status: 404, description: 'Team member not found' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  async confirm(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: any,
  ) {
    return await this.surgeryTeamService.confirmTeamMember(id, user.userId, user.role);
  }

  @Put(':id/decline')
  @ApiOperation({ summary: 'Decline team member assignment' })
  @ApiResponse({ status: 200, description: 'Team member declined successfully' })
  @ApiResponse({ status: 404, description: 'Team member not found' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  async decline(
    @Param('id', ParseUUIDPipe) id: string,
    @Body('declineReason') declineReason: string,
    @CurrentUser() user: any,
  ) {
    return await this.surgeryTeamService.declineTeamMember(id, declineReason, user.userId, user.role);
  }

  @Delete(':id')
  @Roles('surgeon', 'admin')
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: 'Remove team member' })
  @ApiResponse({ status: 200, description: 'Team member removed successfully' })
  @ApiResponse({ status: 404, description: 'Team member not found' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  async remove(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: any,
  ) {
    await this.surgeryTeamService.removeTeamMember(id, user.userId, user.role);
    return { message: 'Team member removed successfully' };
  }

  @Get('role/:role')
  @ApiOperation({ summary: 'Get team members by role' })
  @ApiResponse({ status: 200, description: 'Team members by role retrieved successfully' })
  async getByRole(@Param('role') role: TeamMemberRole) {
    return await this.surgeryTeamService.getTeamMembersByRole(role);
  }

  @Get('member/:memberId')
  @ApiOperation({ summary: 'Get team members by member ID' })
  @ApiResponse({ status: 200, description: 'Team members by member ID retrieved successfully' })
  async getByMember(@Param('memberId', ParseUUIDPipe) memberId: string) {
    return await this.surgeryTeamService.getTeamMembersByMember(memberId);
  }

  @Get('pending/:memberId')
  @ApiOperation({ summary: 'Get pending confirmations for member' })
  @ApiResponse({ status: 200, description: 'Pending confirmations retrieved successfully' })
  async getPendingConfirmations(@Param('memberId', ParseUUIDPipe) memberId: string) {
    return await this.surgeryTeamService.getPendingConfirmations(memberId);
  }

  @Get('statistics/overview')
  @Roles('admin', 'surgeon')
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: 'Get team statistics' })
  @ApiResponse({ status: 200, description: 'Team statistics retrieved successfully' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  async getStatistics(@CurrentUser() user: any) {
    return await this.surgeryTeamService.getTeamStatistics();
  }

  @Get('workload/:memberId')
  @ApiOperation({ summary: 'Get team member workload' })
  @ApiResponse({ status: 200, description: 'Team member workload retrieved successfully' })
  async getWorkload(
    @Param('memberId', ParseUUIDPipe) memberId: string,
    @Query('startDate') startDate: Date,
    @Query('endDate') endDate: Date,
  ) {
    return await this.surgeryTeamService.getTeamMemberWorkload(memberId, startDate, endDate);
  }

  @Get('available/:role')
  @Roles('surgeon', 'admin')
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: 'Get available team members by role' })
  @ApiResponse({ status: 200, description: 'Available team members retrieved successfully' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  async getAvailableTeamMembers(
    @Param('role') role: TeamMemberRole,
    @Query('startDate') startDate: Date,
    @Query('endDate') endDate: Date,
    @CurrentUser() user: any,
  ) {
    return await this.surgeryTeamService.getAvailableTeamMembers(role, startDate, endDate);
  }
}
