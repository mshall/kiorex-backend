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
import { NurseShiftService } from '../services/nurse-shift.service';
import { CreateNurseShiftDto } from '../dto/create-nurse-shift.dto';

@ApiTags('Nurse Shifts')
@Controller('nurse-shifts')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class NurseShiftController {
  constructor(private readonly nurseShiftService: NurseShiftService) {}

  @Post()
  @Roles('admin', 'supervisor')
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: 'Create new nurse shift' })
  @ApiResponse({ status: 201, description: 'Nurse shift created successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  async create(
    @Body(ValidationPipe) createDto: CreateNurseShiftDto,
    @CurrentUser() user: any,
  ) {
    return await this.nurseShiftService.createNurseShift(createDto, user.userId);
  }

  @Get()
  @ApiOperation({ summary: 'Get nurse shifts' })
  @ApiResponse({ status: 200, description: 'Nurse shifts retrieved successfully' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  async findAll(
    @Query() filters: any,
    @CurrentUser() user: any,
  ) {
    return await this.nurseShiftService.getNurseShifts(user.userId, user.role, filters);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get nurse shift by ID' })
  @ApiResponse({ status: 200, description: 'Nurse shift retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Nurse shift not found' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  async findOne(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: any,
  ) {
    return await this.nurseShiftService.getNurseShift(id, user.userId, user.role);
  }

  @Put(':id')
  @Roles('nurse', 'supervisor', 'admin')
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: 'Update nurse shift' })
  @ApiResponse({ status: 200, description: 'Nurse shift updated successfully' })
  @ApiResponse({ status: 404, description: 'Nurse shift not found' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body(ValidationPipe) updateDto: any,
    @CurrentUser() user: any,
  ) {
    return await this.nurseShiftService.updateNurseShift(id, updateDto, user.userId, user.role);
  }

  @Put(':id/start')
  @Roles('nurse', 'admin')
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: 'Start nurse shift' })
  @ApiResponse({ status: 200, description: 'Nurse shift started successfully' })
  @ApiResponse({ status: 404, description: 'Nurse shift not found' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  async start(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: any,
  ) {
    return await this.nurseShiftService.startShift(id, user.userId, user.role);
  }

  @Put(':id/end')
  @Roles('nurse', 'admin')
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: 'End nurse shift' })
  @ApiResponse({ status: 200, description: 'Nurse shift ended successfully' })
  @ApiResponse({ status: 404, description: 'Nurse shift not found' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  async end(
    @Param('id', ParseUUIDPipe) id: string,
    @Body('handoverNotes') handoverNotes: string,
    @CurrentUser() user: any,
  ) {
    return await this.nurseShiftService.endShift(id, handoverNotes, user.userId, user.role);
  }

  @Put(':id/cancel')
  @Roles('nurse', 'supervisor', 'admin')
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: 'Cancel nurse shift' })
  @ApiResponse({ status: 200, description: 'Nurse shift cancelled successfully' })
  @ApiResponse({ status: 404, description: 'Nurse shift not found' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  async cancel(
    @Param('id', ParseUUIDPipe) id: string,
    @Body('cancellationReason') cancellationReason: string,
    @CurrentUser() user: any,
  ) {
    return await this.nurseShiftService.cancelShift(id, cancellationReason, user.userId, user.role);
  }

  @Get('nurse/:nurseId')
  @ApiOperation({ summary: 'Get shifts by nurse' })
  @ApiResponse({ status: 200, description: 'Nurse shifts retrieved successfully' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  async getByNurse(
    @Param('nurseId', ParseUUIDPipe) nurseId: string,
    @CurrentUser() user: any,
  ) {
    return await this.nurseShiftService.getShiftsByNurse(nurseId, user.userId, user.role);
  }

  @Get('unit/:unit')
  @ApiOperation({ summary: 'Get shifts by unit' })
  @ApiResponse({ status: 200, description: 'Unit shifts retrieved successfully' })
  async getByUnit(@Param('unit') unit: string) {
    return await this.nurseShiftService.getShiftsByUnit(unit);
  }

  @Get('current/shifts')
  @ApiOperation({ summary: 'Get current shifts' })
  @ApiResponse({ status: 200, description: 'Current shifts retrieved successfully' })
  async getCurrentShifts() {
    return await this.nurseShiftService.getCurrentShifts();
  }

  @Get('upcoming/shifts')
  @ApiOperation({ summary: 'Get upcoming shifts' })
  @ApiResponse({ status: 200, description: 'Upcoming shifts retrieved successfully' })
  async getUpcomingShifts(@Query('days') days: number = 7) {
    return await this.nurseShiftService.getUpcomingShifts(days);
  }

  @Get('statistics/overview')
  @Roles('admin', 'supervisor')
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: 'Get shift statistics' })
  @ApiResponse({ status: 200, description: 'Shift statistics retrieved successfully' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  async getStatistics(@CurrentUser() user: any) {
    return await this.nurseShiftService.getShiftStatistics(user.userId, user.role);
  }

  @Get('workload/:nurseId')
  @ApiOperation({ summary: 'Get nurse workload' })
  @ApiResponse({ status: 200, description: 'Nurse workload retrieved successfully' })
  async getWorkload(
    @Param('nurseId', ParseUUIDPipe) nurseId: string,
    @Query('startDate') startDate: Date,
    @Query('endDate') endDate: Date,
  ) {
    return await this.nurseShiftService.getNurseWorkload(nurseId, startDate, endDate);
  }
}
