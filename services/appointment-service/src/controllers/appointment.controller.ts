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
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { CurrentUser } from '../decorators/current-user.decorator';
import { AppointmentService } from '../services/appointment.service';
import { CreateAppointmentDto } from '../dto/create-appointment.dto';
import { UpdateAppointmentDto } from '../dto/update-appointment.dto';
import { RescheduleAppointmentDto } from '../dto/reschedule-appointment.dto';

@ApiTags('Appointments')
@Controller('appointments')
@UseGuards(JwtAuthGuard)
export class AppointmentController {
  constructor(private readonly appointmentService: AppointmentService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new appointment' })
  @ApiResponse({ status: 201, description: 'Appointment created successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 409, description: 'Conflict - slot not available' })
  async create(
    @Body(ValidationPipe) createDto: CreateAppointmentDto,
    @CurrentUser() user: any,
  ) {
    return await this.appointmentService.createAppointment(createDto, user.userId);
  }

  @Get()
  @ApiOperation({ summary: 'Get appointments with filters' })
  @ApiResponse({ status: 200, description: 'Appointments retrieved successfully' })
  async findAll(@Query() filters: any) {
    return await this.appointmentService.findAllAppointments(filters);
  }

  @Get('upcoming')
  @ApiOperation({ summary: 'Get upcoming appointments' })
  @ApiResponse({ status: 200, description: 'Upcoming appointments retrieved successfully' })
  async getUpcoming(@CurrentUser() user: any) {
    const role = user.roles.includes('provider') ? 'provider' : 'patient';
    return await this.appointmentService.getUpcomingAppointments(user.userId, role);
  }

  @Get('history')
  @ApiOperation({ summary: 'Get appointment history' })
  @ApiResponse({ status: 200, description: 'Appointment history retrieved successfully' })
  async getHistory(
    @CurrentUser() user: any,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 20,
  ) {
    const role = user.roles.includes('provider') ? 'provider' : 'patient';
    return await this.appointmentService.getAppointmentHistory(user.userId, role, page, limit);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get appointment by ID' })
  @ApiResponse({ status: 200, description: 'Appointment retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Appointment not found' })
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    return await this.appointmentService.getAppointmentById(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update appointment' })
  @ApiResponse({ status: 200, description: 'Appointment updated successfully' })
  @ApiResponse({ status: 404, description: 'Appointment not found' })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body(ValidationPipe) updateDto: UpdateAppointmentDto,
  ) {
    return await this.appointmentService.updateAppointment(id, updateDto);
  }

  @Post(':id/reschedule')
  @ApiOperation({ summary: 'Reschedule appointment' })
  @ApiResponse({ status: 200, description: 'Appointment rescheduled successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 409, description: 'Conflict with new slot' })
  async reschedule(
    @Param('id', ParseUUIDPipe) id: string,
    @Body(ValidationPipe) rescheduleDto: RescheduleAppointmentDto,
  ) {
    return await this.appointmentService.rescheduleAppointment(id, rescheduleDto);
  }

  @Post(':id/cancel')
  @ApiOperation({ summary: 'Cancel appointment' })
  @ApiResponse({ status: 200, description: 'Appointment cancelled successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  async cancel(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() cancelDto: { reason: string },
    @CurrentUser() user: any,
  ) {
    return await this.appointmentService.cancelAppointment(id, user.userId, cancelDto.reason);
  }

  @Post(':id/check-in')
  @ApiOperation({ summary: 'Check in for appointment' })
  @ApiResponse({ status: 200, description: 'Checked in successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  async checkIn(@Param('id', ParseUUIDPipe) id: string) {
    return await this.appointmentService.checkIn(id);
  }

  @Post(':id/start')
  @ApiOperation({ summary: 'Start appointment' })
  @ApiResponse({ status: 200, description: 'Appointment started successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  async start(@Param('id', ParseUUIDPipe) id: string) {
    return await this.appointmentService.startAppointment(id);
  }

  @Post(':id/complete')
  @ApiOperation({ summary: 'Complete appointment' })
  @ApiResponse({ status: 200, description: 'Appointment completed successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  async complete(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() completionData: any,
  ) {
    return await this.appointmentService.completeAppointment(id, completionData);
  }

  @Post(':id/no-show')
  @ApiOperation({ summary: 'Mark appointment as no-show' })
  @ApiResponse({ status: 200, description: 'Appointment marked as no-show' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  async markNoShow(@Param('id', ParseUUIDPipe) id: string) {
    return await this.appointmentService.markAsNoShow(id);
  }

  @Get('reports/no-shows')
  @ApiOperation({ summary: 'Get no-show report' })
  @ApiResponse({ status: 200, description: 'No-show report retrieved successfully' })
  async getNoShowReport(
    @Query('providerId') providerId: string,
    @Query('startDate') startDate: Date,
    @Query('endDate') endDate: Date,
  ) {
    return await this.appointmentService.getNoShowReport(providerId, startDate, endDate);
  }
}
