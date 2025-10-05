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
import { PatientCareService } from '../services/patient-care.service';
import { CreatePatientCareDto } from '../dto/create-patient-care.dto';

@ApiTags('Patient Care')
@Controller('patient-care')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class PatientCareController {
  constructor(private readonly patientCareService: PatientCareService) {}

  @Post()
  @Roles('nurse', 'admin')
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: 'Create new patient care' })
  @ApiResponse({ status: 201, description: 'Patient care created successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  async create(
    @Body(ValidationPipe) createDto: CreatePatientCareDto,
    @CurrentUser() user: any,
  ) {
    return await this.patientCareService.createPatientCare(createDto, user.userId);
  }

  @Get()
  @ApiOperation({ summary: 'Get patient care' })
  @ApiResponse({ status: 200, description: 'Patient care retrieved successfully' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  async findAll(
    @Query() filters: any,
    @CurrentUser() user: any,
  ) {
    return await this.patientCareService.getPatientCare(user.userId, user.role, filters);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get patient care by ID' })
  @ApiResponse({ status: 200, description: 'Patient care retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Patient care not found' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  async findOne(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: any,
  ) {
    return await this.patientCareService.getPatientCareById(id, user.userId, user.role);
  }

  @Put(':id')
  @Roles('nurse', 'supervisor', 'admin')
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: 'Update patient care' })
  @ApiResponse({ status: 200, description: 'Patient care updated successfully' })
  @ApiResponse({ status: 404, description: 'Patient care not found' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body(ValidationPipe) updateDto: any,
    @CurrentUser() user: any,
  ) {
    return await this.patientCareService.updatePatientCare(id, updateDto, user.userId, user.role);
  }

  @Put(':id/start')
  @Roles('nurse', 'admin')
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: 'Start patient care' })
  @ApiResponse({ status: 200, description: 'Patient care started successfully' })
  @ApiResponse({ status: 404, description: 'Patient care not found' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  async start(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: any,
  ) {
    return await this.patientCareService.startCare(id, user.userId, user.role);
  }

  @Put(':id/complete')
  @Roles('nurse', 'admin')
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: 'Complete patient care' })
  @ApiResponse({ status: 200, description: 'Patient care completed successfully' })
  @ApiResponse({ status: 404, description: 'Patient care not found' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  async complete(
    @Param('id', ParseUUIDPipe) id: string,
    @Body('outcome') outcome: string,
    @Body('notes') notes: string,
    @CurrentUser() user: any,
  ) {
    return await this.patientCareService.completeCare(id, outcome, notes, user.userId, user.role);
  }

  @Put(':id/cancel')
  @Roles('nurse', 'supervisor', 'admin')
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: 'Cancel patient care' })
  @ApiResponse({ status: 200, description: 'Patient care cancelled successfully' })
  @ApiResponse({ status: 404, description: 'Patient care not found' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  async cancel(
    @Param('id', ParseUUIDPipe) id: string,
    @Body('reason') reason: string,
    @CurrentUser() user: any,
  ) {
    return await this.patientCareService.cancelCare(id, reason, user.userId, user.role);
  }

  @Get('patient/:patientId')
  @ApiOperation({ summary: 'Get care by patient' })
  @ApiResponse({ status: 200, description: 'Patient care retrieved successfully' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  async getByPatient(
    @Param('patientId', ParseUUIDPipe) patientId: string,
    @CurrentUser() user: any,
  ) {
    return await this.patientCareService.getCareByPatient(patientId, user.userId, user.role);
  }

  @Get('nurse/:nurseId')
  @ApiOperation({ summary: 'Get care by nurse' })
  @ApiResponse({ status: 200, description: 'Nurse care retrieved successfully' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  async getByNurse(
    @Param('nurseId', ParseUUIDPipe) nurseId: string,
    @CurrentUser() user: any,
  ) {
    return await this.patientCareService.getCareByNurse(nurseId, user.userId, user.role);
  }

  @Get('pending/care')
  @ApiOperation({ summary: 'Get pending care' })
  @ApiResponse({ status: 200, description: 'Pending care retrieved successfully' })
  async getPendingCare() {
    return await this.patientCareService.getPendingCare();
  }

  @Get('overdue/care')
  @ApiOperation({ summary: 'Get overdue care' })
  @ApiResponse({ status: 200, description: 'Overdue care retrieved successfully' })
  async getOverdueCare() {
    return await this.patientCareService.getOverdueCare();
  }

  @Get('statistics/overview')
  @Roles('admin', 'supervisor')
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: 'Get care statistics' })
  @ApiResponse({ status: 200, description: 'Care statistics retrieved successfully' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  async getStatistics(@CurrentUser() user: any) {
    return await this.patientCareService.getCareStatistics(user.userId, user.role);
  }

  @Get('workload/:nurseId')
  @ApiOperation({ summary: 'Get nurse care workload' })
  @ApiResponse({ status: 200, description: 'Nurse care workload retrieved successfully' })
  async getWorkload(
    @Param('nurseId', ParseUUIDPipe) nurseId: string,
    @Query('startDate') startDate: Date,
    @Query('endDate') endDate: Date,
  ) {
    return await this.patientCareService.getNurseCareWorkload(nurseId, startDate, endDate);
  }
}
