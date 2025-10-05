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
import { LabResultService } from '../services/lab-result.service';
import { CreateLabResultDto } from '../dto/create-lab-result.dto';

@ApiTags('Lab Results')
@Controller('lab-results')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class LabResultController {
  constructor(private readonly labResultService: LabResultService) {}

  @Post()
  @Roles('lab_technician', 'admin')
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: 'Create new lab result' })
  @ApiResponse({ status: 201, description: 'Lab result created successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  async create(
    @Body(ValidationPipe) createDto: CreateLabResultDto,
    @CurrentUser() user: any,
  ) {
    return await this.labResultService.createLabResult(createDto, user.userId);
  }

  @Get()
  @ApiOperation({ summary: 'Get lab results' })
  @ApiResponse({ status: 200, description: 'Lab results retrieved successfully' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  async findAll(
    @Query() filters: any,
    @CurrentUser() user: any,
  ) {
    return await this.labResultService.getLabResults(user.userId, user.role, filters);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get lab result by ID' })
  @ApiResponse({ status: 200, description: 'Lab result retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Lab result not found' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  async findOne(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: any,
  ) {
    return await this.labResultService.getLabResult(id, user.userId, user.role);
  }

  @Put(':id')
  @Roles('lab_technician', 'lab_manager', 'admin')
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: 'Update lab result' })
  @ApiResponse({ status: 200, description: 'Lab result updated successfully' })
  @ApiResponse({ status: 404, description: 'Lab result not found' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body(ValidationPipe) updateDto: any,
    @CurrentUser() user: any,
  ) {
    return await this.labResultService.updateLabResult(id, updateDto, user.userId, user.role);
  }

  @Get('patient/:patientId')
  @ApiOperation({ summary: 'Get lab results by patient' })
  @ApiResponse({ status: 200, description: 'Patient lab results retrieved successfully' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  async getByPatient(
    @Param('patientId', ParseUUIDPipe) patientId: string,
    @CurrentUser() user: any,
  ) {
    return await this.labResultService.getLabResultsByPatient(patientId, user.userId, user.role);
  }

  @Get('provider/:providerId')
  @ApiOperation({ summary: 'Get lab results by provider' })
  @ApiResponse({ status: 200, description: 'Provider lab results retrieved successfully' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  async getByProvider(
    @Param('providerId', ParseUUIDPipe) providerId: string,
    @CurrentUser() user: any,
  ) {
    return await this.labResultService.getLabResultsByProvider(providerId, user.userId, user.role);
  }

  @Get('pending/results')
  @Roles('lab_technician', 'admin')
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: 'Get pending lab results' })
  @ApiResponse({ status: 200, description: 'Pending lab results retrieved successfully' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  async getPendingResults(@CurrentUser() user: any) {
    return await this.labResultService.getPendingLabResults(user.userId, user.role);
  }

  @Get('critical/results')
  @Roles('provider', 'lab_technician', 'admin')
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: 'Get critical lab results' })
  @ApiResponse({ status: 200, description: 'Critical lab results retrieved successfully' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  async getCriticalResults(@CurrentUser() user: any) {
    return await this.labResultService.getCriticalLabResults(user.userId, user.role);
  }

  @Get('statistics/overview')
  @Roles('admin', 'lab_manager')
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: 'Get lab result statistics' })
  @ApiResponse({ status: 200, description: 'Lab result statistics retrieved successfully' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  async getStatistics(@CurrentUser() user: any) {
    return await this.labResultService.getLabResultStatistics(user.userId, user.role);
  }

  @Get('trends/patient/:patientId/test/:testCode')
  @ApiOperation({ summary: 'Get lab result trends for a specific test' })
  @ApiResponse({ status: 200, description: 'Lab result trends retrieved successfully' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  async getTrends(
    @Param('patientId', ParseUUIDPipe) patientId: string,
    @Param('testCode') testCode: string,
    @CurrentUser() user: any,
  ) {
    return await this.labResultService.getLabResultTrends(patientId, testCode, user.userId, user.role);
  }
}
