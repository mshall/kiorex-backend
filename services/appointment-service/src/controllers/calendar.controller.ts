import {
  Controller,
  Get,
  Query,
  UseGuards,
  ParseUUIDPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { CurrentUser } from '../decorators/current-user.decorator';
import { CalendarService } from '../services/calendar.service';

@ApiTags('Calendar')
@Controller('calendar')
@UseGuards(JwtAuthGuard)
export class CalendarController {
  constructor(private readonly calendarService: CalendarService) {}

  @Get('provider/:providerId')
  @ApiOperation({ summary: 'Get provider calendar' })
  @ApiResponse({ status: 200, description: 'Provider calendar retrieved successfully' })
  async getProviderCalendar(
    @Param('providerId', ParseUUIDPipe) providerId: string,
    @Query('startDate') startDate: Date,
    @Query('endDate') endDate: Date,
  ) {
    return await this.calendarService.getProviderCalendar(providerId, startDate, endDate);
  }

  @Get('patient')
  @ApiOperation({ summary: 'Get patient calendar' })
  @ApiResponse({ status: 200, description: 'Patient calendar retrieved successfully' })
  async getPatientCalendar(
    @CurrentUser() user: any,
    @Query('startDate') startDate: Date,
    @Query('endDate') endDate: Date,
  ) {
    return await this.calendarService.getPatientCalendar(user.userId, startDate, endDate);
  }

  @Get('availability/:providerId')
  @ApiOperation({ summary: 'Get provider availability' })
  @ApiResponse({ status: 200, description: 'Provider availability retrieved successfully' })
  async getAvailability(
    @Param('providerId', ParseUUIDPipe) providerId: string,
    @Query('startDate') startDate: Date,
    @Query('endDate') endDate: Date,
    @Query('appointmentTypeId') appointmentTypeId?: string,
  ) {
    return await this.calendarService.getAvailability(
      providerId,
      startDate,
      endDate,
      appointmentTypeId,
    );
  }

  @Get('busy/:providerId')
  @ApiOperation({ summary: 'Get provider busy times' })
  @ApiResponse({ status: 200, description: 'Provider busy times retrieved successfully' })
  async getBusyTimes(
    @Param('providerId', ParseUUIDPipe) providerId: string,
    @Query('startDate') startDate: Date,
    @Query('endDate') endDate: Date,
  ) {
    return await this.calendarService.getBusyTimes(providerId, startDate, endDate);
  }

  @Get('stats/:providerId')
  @ApiOperation({ summary: 'Get monthly statistics' })
  @ApiResponse({ status: 200, description: 'Monthly statistics retrieved successfully' })
  async getMonthlyStats(
    @Param('providerId', ParseUUIDPipe) providerId: string,
    @Query('year') year: number,
    @Query('month') month: number,
  ) {
    return await this.calendarService.getMonthlyStats(providerId, year, month);
  }
}
