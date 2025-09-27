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
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { RolesGuard } from '../guards/roles.guard';
import { Roles } from '../decorators/roles.decorator';
import { CurrentUser } from '../decorators/current-user.decorator';
import { MedicalRecordService } from '../services/medical-record.service';
import { CreateMedicalRecordDto } from '../dto/create-medical-record.dto';
import { UpdateMedicalRecordDto } from '../dto/update-medical-record.dto';

@ApiTags('Medical Records')
@Controller('medical-records')
@UseGuards(JwtAuthGuard)
export class MedicalRecordController {
  constructor(private readonly medicalRecordService: MedicalRecordService) {}

  @Post()
  @Roles('provider', 'admin')
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: 'Create medical record' })
  @ApiResponse({ status: 201, description: 'Medical record created successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  async create(
    @Body(ValidationPipe) createDto: CreateMedicalRecordDto,
    @CurrentUser() user: any,
  ) {
    return await this.medicalRecordService.createMedicalRecord(createDto, user.userId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get medical record by ID' })
  @ApiResponse({ status: 200, description: 'Medical record retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Medical record not found' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  async findOne(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: any,
  ) {
    return await this.medicalRecordService.getMedicalRecord(
      id,
      user.userId,
      user.roles[0],
    );
  }

  @Get('patient/:patientId')
  @ApiOperation({ summary: 'Get patient medical records' })
  @ApiResponse({ status: 200, description: 'Patient medical records retrieved successfully' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  async getPatientRecords(
    @Param('patientId', ParseUUIDPipe) patientId: string,
    @Query() filters: any,
    @CurrentUser() user: any,
  ) {
    return await this.medicalRecordService.getPatientRecords(
      patientId,
      user.userId,
      user.roles[0],
      filters,
    );
  }

  @Put(':id')
  @Roles('provider', 'admin')
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: 'Update medical record' })
  @ApiResponse({ status: 200, description: 'Medical record updated successfully' })
  @ApiResponse({ status: 404, description: 'Medical record not found' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body(ValidationPipe) updateDto: UpdateMedicalRecordDto,
    @CurrentUser() user: any,
  ) {
    return await this.medicalRecordService.updateMedicalRecord(
      id,
      updateDto,
      user.userId,
      user.roles[0],
    );
  }

  @Get('patient/:patientId/summary')
  @ApiOperation({ summary: 'Get patient summary' })
  @ApiResponse({ status: 200, description: 'Patient summary retrieved successfully' })
  async getPatientSummary(
    @Param('patientId', ParseUUIDPipe) patientId: string,
  ) {
    return await this.medicalRecordService.getPatientSummary(patientId);
  }

  @Get('patient/:patientId/export-fhir')
  @ApiOperation({ summary: 'Export patient records to FHIR format' })
  @ApiResponse({ status: 200, description: 'FHIR export completed successfully' })
  async exportToFHIR(
    @Param('patientId', ParseUUIDPipe) patientId: string,
  ) {
    return await this.medicalRecordService.exportToFHIR(patientId);
  }
}
