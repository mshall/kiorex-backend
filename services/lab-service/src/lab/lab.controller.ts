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
import { LabService } from './lab.service';
import { CreateLabTestDto } from './dto/create-lab-test.dto';
import { CreateLabBookingDto } from './dto/create-lab-booking.dto';
import { CreateLabResultDto } from './dto/create-lab-result.dto';

@ApiTags('Lab')
@Controller('labs')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class LabController {
  constructor(private readonly labService: LabService) {}

  // Lab Tests
  @Get('tests')
  @ApiOperation({ summary: 'Search lab tests' })
  @ApiResponse({ status: 200, description: 'Lab tests retrieved successfully' })
  async searchTests(
    @Query() filters: {
      search?: string;
      category?: string;
      priceMin?: number;
      priceMax?: number;
      location?: string;
      page?: number;
      limit?: number;
    },
  ) {
    return await this.labService.searchTests(filters);
  }

  @Get('tests/:id')
  @ApiOperation({ summary: 'Get lab test by ID' })
  @ApiResponse({ status: 200, description: 'Lab test retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Lab test not found' })
  async getTest(@Param('id', ParseUUIDPipe) id: string) {
    return await this.labService.getTest(id);
  }

  @Post('tests')
  @Roles('admin', 'lab_manager')
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: 'Create lab test' })
  @ApiResponse({ status: 201, description: 'Lab test created successfully' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  async createTest(@Body(ValidationPipe) createTestDto: CreateLabTestDto) {
    return await this.labService.createTest(createTestDto);
  }

  // Lab Partners
  @Get('partners')
  @ApiOperation({ summary: 'Get lab partners' })
  @ApiResponse({ status: 200, description: 'Lab partners retrieved successfully' })
  async getLabPartners(
    @Query() filters: {
      location?: string;
      rating?: number;
      page?: number;
      limit?: number;
    },
  ) {
    return await this.labService.getLabPartners(filters);
  }

  @Get('partners/:id')
  @ApiOperation({ summary: 'Get lab partner by ID' })
  @ApiResponse({ status: 200, description: 'Lab partner retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Lab partner not found' })
  async getLabPartner(@Param('id', ParseUUIDPipe) id: string) {
    return await this.labService.getLabPartner(id);
  }

  // Lab Bookings
  @Post('bookings')
  @ApiOperation({ summary: 'Create lab booking' })
  @ApiResponse({ status: 201, description: 'Lab booking created successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  async createBooking(
    @Body(ValidationPipe) createBookingDto: CreateLabBookingDto,
    @CurrentUser() user: any,
  ) {
    return await this.labService.createBooking(createBookingDto, user.userId);
  }

  @Get('bookings')
  @ApiOperation({ summary: 'Get user lab bookings' })
  @ApiResponse({ status: 200, description: 'Lab bookings retrieved successfully' })
  async getUserBookings(
    @CurrentUser() user: any,
    @Query() filters: {
      status?: string;
      startDate?: Date;
      endDate?: Date;
      page?: number;
      limit?: number;
    },
  ) {
    return await this.labService.getUserBookings(user.userId, filters);
  }

  @Get('bookings/:id')
  @ApiOperation({ summary: 'Get lab booking by ID' })
  @ApiResponse({ status: 200, description: 'Lab booking retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Lab booking not found' })
  async getBooking(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: any,
  ) {
    return await this.labService.getBooking(id, user.userId);
  }

  @Put('bookings/:id/cancel')
  @ApiOperation({ summary: 'Cancel lab booking' })
  @ApiResponse({ status: 200, description: 'Lab booking cancelled successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  async cancelBooking(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: any,
    @Body() cancelDto: { reason: string },
  ) {
    return await this.labService.cancelBooking(id, user.userId, cancelDto.reason);
  }

  @Post('bookings/:id/reschedule')
  @ApiOperation({ summary: 'Reschedule lab booking' })
  @ApiResponse({ status: 200, description: 'Lab booking rescheduled successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  async rescheduleBooking(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() rescheduleDto: { newDateTime: Date },
    @CurrentUser() user: any,
  ) {
    return await this.labService.rescheduleBooking(id, rescheduleDto.newDateTime, user.userId);
  }

  // Lab Results
  @Post('results')
  @Roles('lab_technician', 'admin')
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: 'Upload lab results' })
  @ApiResponse({ status: 201, description: 'Lab results uploaded successfully' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  async uploadResults(
    @Body(ValidationPipe) createResultDto: CreateLabResultDto,
    @CurrentUser() user: any,
  ) {
    return await this.labService.uploadResults(createResultDto, user.userId);
  }

  @Get('results')
  @ApiOperation({ summary: 'Get user lab results' })
  @ApiResponse({ status: 200, description: 'Lab results retrieved successfully' })
  async getUserResults(
    @CurrentUser() user: any,
    @Query() filters: {
      testId?: string;
      startDate?: Date;
      endDate?: Date;
      page?: number;
      limit?: number;
    },
  ) {
    return await this.labService.getUserResults(user.userId, filters);
  }

  @Get('results/:id')
  @ApiOperation({ summary: 'Get lab result by ID' })
  @ApiResponse({ status: 200, description: 'Lab result retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Lab result not found' })
  async getResult(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: any,
  ) {
    return await this.labService.getResult(id, user.userId);
  }

  @Get('results/:id/download')
  @ApiOperation({ summary: 'Download lab result PDF' })
  @ApiResponse({ status: 200, description: 'Lab result PDF downloaded successfully' })
  @ApiResponse({ status: 404, description: 'Lab result not found' })
  async downloadResult(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: any,
  ) {
    return await this.labService.downloadResult(id, user.userId);
  }

  // Home Collection
  @Post('bookings/:id/home-collection')
  @ApiOperation({ summary: 'Schedule home collection' })
  @ApiResponse({ status: 200, description: 'Home collection scheduled successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  async scheduleHomeCollection(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() collectionDto: {
      address: string;
      preferredTime: string;
      contactPhone: string;
    },
    @CurrentUser() user: any,
  ) {
    return await this.labService.scheduleHomeCollection(id, collectionDto, user.userId);
  }

  @Get('bookings/:id/collection-status')
  @ApiOperation({ summary: 'Get home collection status' })
  @ApiResponse({ status: 200, description: 'Collection status retrieved successfully' })
  async getCollectionStatus(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: any,
  ) {
    return await this.labService.getCollectionStatus(id, user.userId);
  }

  // Reports and Analytics
  @Get('reports/abnormal-results')
  @Roles('doctor', 'admin')
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: 'Get abnormal lab results' })
  @ApiResponse({ status: 200, description: 'Abnormal results retrieved successfully' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  async getAbnormalResults(
    @Query() filters: {
      startDate?: Date;
      endDate?: Date;
      severity?: string;
      page?: number;
      limit?: number;
    },
  ) {
    return await this.labService.getAbnormalResults(filters);
  }

  @Get('reports/statistics')
  @Roles('admin', 'lab_manager')
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: 'Get lab statistics' })
  @ApiResponse({ status: 200, description: 'Lab statistics retrieved successfully' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  async getLabStatistics(
    @Query() filters: {
      startDate?: Date;
      endDate?: Date;
      labId?: string;
    },
  ) {
    return await this.labService.getLabStatistics(filters);
  }
}
