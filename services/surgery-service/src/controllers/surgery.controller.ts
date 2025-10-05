import {
  Controller,
  Get,
  Post,
  Put,
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
import { SurgeryService } from '../services/surgery.service';
import { CreateSurgeryDto } from '../dto/create-surgery.dto';

@ApiTags('Surgeries')
@Controller('surgeries')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class SurgeryController {
  constructor(private readonly surgeryService: SurgeryService) {}

  @Post()
  @Roles('surgeon', 'admin')
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: 'Create new surgery' })
  @ApiResponse({ status: 201, description: 'Surgery created successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  async create(
    @Body(ValidationPipe) createDto: CreateSurgeryDto,
    @CurrentUser() user: any,
  ) {
    return await this.surgeryService.createSurgery(createDto, user.userId);
  }

  @Get()
  @ApiOperation({ summary: 'Get surgeries' })
  @ApiResponse({ status: 200, description: 'Surgeries retrieved successfully' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  async findAll(
    @Query() filters: any,
    @CurrentUser() user: any,
  ) {
    return await this.surgeryService.getSurgeries(user.userId, user.role, filters);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get surgery by ID' })
  @ApiResponse({ status: 200, description: 'Surgery retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Surgery not found' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  async findOne(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: any,
  ) {
    return await this.surgeryService.getSurgery(id, user.userId, user.role);
  }

  @Put(':id')
  @Roles('surgeon', 'admin')
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: 'Update surgery' })
  @ApiResponse({ status: 200, description: 'Surgery updated successfully' })
  @ApiResponse({ status: 404, description: 'Surgery not found' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body(ValidationPipe) updateDto: any,
    @CurrentUser() user: any,
  ) {
    return await this.surgeryService.updateSurgery(id, updateDto, user.userId, user.role);
  }

  @Put(':id/start')
  @Roles('surgeon', 'admin')
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: 'Start surgery' })
  @ApiResponse({ status: 200, description: 'Surgery started successfully' })
  @ApiResponse({ status: 404, description: 'Surgery not found' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  async start(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: any,
  ) {
    return await this.surgeryService.startSurgery(id, user.userId, user.role);
  }

  @Put(':id/complete')
  @Roles('surgeon', 'admin')
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: 'Complete surgery' })
  @ApiResponse({ status: 200, description: 'Surgery completed successfully' })
  @ApiResponse({ status: 404, description: 'Surgery not found' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  async complete(
    @Param('id', ParseUUIDPipe) id: string,
    @Body('operativeNotes') operativeNotes: string,
    @CurrentUser() user: any,
  ) {
    return await this.surgeryService.completeSurgery(id, operativeNotes, user.userId, user.role);
  }

  @Put(':id/cancel')
  @Roles('surgeon', 'admin')
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: 'Cancel surgery' })
  @ApiResponse({ status: 200, description: 'Surgery cancelled successfully' })
  @ApiResponse({ status: 404, description: 'Surgery not found' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  async cancel(
    @Param('id', ParseUUIDPipe) id: string,
    @Body('cancellationReason') cancellationReason: string,
    @CurrentUser() user: any,
  ) {
    return await this.surgeryService.cancelSurgery(id, cancellationReason, user.userId, user.role);
  }

  @Put(':id/postpone')
  @Roles('surgeon', 'admin')
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: 'Postpone surgery' })
  @ApiResponse({ status: 200, description: 'Surgery postponed successfully' })
  @ApiResponse({ status: 404, description: 'Surgery not found' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  async postpone(
    @Param('id', ParseUUIDPipe) id: string,
    @Body('postponementReason') postponementReason: string,
    @Body('rescheduledDate') rescheduledDate: Date,
    @CurrentUser() user: any,
  ) {
    return await this.surgeryService.postponeSurgery(id, postponementReason, rescheduledDate, user.userId, user.role);
  }

  @Get('patient/:patientId')
  @ApiOperation({ summary: 'Get surgeries by patient' })
  @ApiResponse({ status: 200, description: 'Patient surgeries retrieved successfully' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  async getByPatient(
    @Param('patientId', ParseUUIDPipe) patientId: string,
    @CurrentUser() user: any,
  ) {
    return await this.surgeryService.getSurgeriesByPatient(patientId, user.userId, user.role);
  }

  @Get('surgeon/:surgeonId')
  @ApiOperation({ summary: 'Get surgeries by surgeon' })
  @ApiResponse({ status: 200, description: 'Surgeon surgeries retrieved successfully' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  async getBySurgeon(
    @Param('surgeonId', ParseUUIDPipe) surgeonId: string,
    @CurrentUser() user: any,
  ) {
    return await this.surgeryService.getSurgeriesBySurgeon(surgeonId, user.userId, user.role);
  }

  @Get('scheduled/list')
  @Roles('surgeon', 'admin', 'nurse')
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: 'Get scheduled surgeries' })
  @ApiResponse({ status: 200, description: 'Scheduled surgeries retrieved successfully' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  async getScheduledSurgeries(@CurrentUser() user: any) {
    return await this.surgeryService.getScheduledSurgeries(user.userId, user.role);
  }

  @Get('upcoming/list')
  @ApiOperation({ summary: 'Get upcoming surgeries' })
  @ApiResponse({ status: 200, description: 'Upcoming surgeries retrieved successfully' })
  async getUpcomingSurgeries(@Query('days') days: number = 7) {
    return await this.surgeryService.getUpcomingSurgeries(days);
  }

  @Get('statistics/overview')
  @Roles('admin', 'surgeon')
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: 'Get surgery statistics' })
  @ApiResponse({ status: 200, description: 'Surgery statistics retrieved successfully' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  async getStatistics(@CurrentUser() user: any) {
    return await this.surgeryService.getSurgeryStatistics(user.userId, user.role);
  }

  @Get('history/patient/:patientId')
  @ApiOperation({ summary: 'Get surgery history for patient' })
  @ApiResponse({ status: 200, description: 'Surgery history retrieved successfully' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  async getSurgeryHistory(
    @Param('patientId', ParseUUIDPipe) patientId: string,
    @CurrentUser() user: any,
  ) {
    return await this.surgeryService.getSurgeryHistory(patientId, user.userId, user.role);
  }
}
