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
import { PrescriptionService } from '../services/prescription.service';
import { CreatePrescriptionDto } from '../dto/create-prescription.dto';

@ApiTags('Prescriptions')
@Controller('prescriptions')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class PrescriptionController {
  constructor(private readonly prescriptionService: PrescriptionService) {}

  @Post()
  @Roles('provider', 'admin')
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: 'Create new prescription' })
  @ApiResponse({ status: 201, description: 'Prescription created successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  async create(
    @Body(ValidationPipe) createDto: CreatePrescriptionDto,
    @CurrentUser() user: any,
  ) {
    return await this.prescriptionService.createPrescription(createDto, user.userId);
  }

  @Get()
  @ApiOperation({ summary: 'Get prescriptions' })
  @ApiResponse({ status: 200, description: 'Prescriptions retrieved successfully' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  async findAll(
    @Query() filters: any,
    @CurrentUser() user: any,
  ) {
    return await this.prescriptionService.getPrescriptions(user.userId, user.role, filters);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get prescription by ID' })
  @ApiResponse({ status: 200, description: 'Prescription retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Prescription not found' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  async findOne(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: any,
  ) {
    return await this.prescriptionService.getPrescription(id, user.userId, user.role);
  }

  @Put(':id')
  @Roles('provider', 'pharmacist', 'admin')
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: 'Update prescription' })
  @ApiResponse({ status: 200, description: 'Prescription updated successfully' })
  @ApiResponse({ status: 404, description: 'Prescription not found' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body(ValidationPipe) updateDto: any,
    @CurrentUser() user: any,
  ) {
    return await this.prescriptionService.updatePrescription(id, updateDto, user.userId, user.role);
  }

  @Put(':id/approve')
  @Roles('pharmacist', 'admin')
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: 'Approve prescription' })
  @ApiResponse({ status: 200, description: 'Prescription approved successfully' })
  @ApiResponse({ status: 404, description: 'Prescription not found' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  async approve(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: any,
  ) {
    return await this.prescriptionService.approvePrescription(id, user.userId, user.role);
  }

  @Put(':id/reject')
  @Roles('pharmacist', 'admin')
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: 'Reject prescription' })
  @ApiResponse({ status: 200, description: 'Prescription rejected successfully' })
  @ApiResponse({ status: 404, description: 'Prescription not found' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  async reject(
    @Param('id', ParseUUIDPipe) id: string,
    @Body('rejectionReason') rejectionReason: string,
    @CurrentUser() user: any,
  ) {
    return await this.prescriptionService.rejectPrescription(id, rejectionReason, user.userId, user.role);
  }

  @Put(':id/dispense')
  @Roles('pharmacist', 'admin')
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: 'Dispense prescription' })
  @ApiResponse({ status: 200, description: 'Prescription dispensed successfully' })
  @ApiResponse({ status: 404, description: 'Prescription not found' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  async dispense(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: any,
  ) {
    return await this.prescriptionService.dispensePrescription(id, user.userId, user.role);
  }

  @Put(':id/complete')
  @Roles('pharmacist', 'admin')
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: 'Complete prescription' })
  @ApiResponse({ status: 200, description: 'Prescription completed successfully' })
  @ApiResponse({ status: 404, description: 'Prescription not found' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  async complete(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: any,
  ) {
    return await this.prescriptionService.completePrescription(id, user.userId, user.role);
  }

  @Put(':id/cancel')
  @Roles('provider', 'pharmacist', 'admin')
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: 'Cancel prescription' })
  @ApiResponse({ status: 200, description: 'Prescription cancelled successfully' })
  @ApiResponse({ status: 404, description: 'Prescription not found' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  async cancel(
    @Param('id', ParseUUIDPipe) id: string,
    @Body('cancellationReason') cancellationReason: string,
    @CurrentUser() user: any,
  ) {
    return await this.prescriptionService.cancelPrescription(id, cancellationReason, user.userId, user.role);
  }

  @Get('patient/:patientId')
  @ApiOperation({ summary: 'Get prescriptions by patient' })
  @ApiResponse({ status: 200, description: 'Patient prescriptions retrieved successfully' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  async getByPatient(
    @Param('patientId', ParseUUIDPipe) patientId: string,
    @CurrentUser() user: any,
  ) {
    return await this.prescriptionService.getPrescriptionsByPatient(patientId, user.userId, user.role);
  }

  @Get('provider/:providerId')
  @ApiOperation({ summary: 'Get prescriptions by provider' })
  @ApiResponse({ status: 200, description: 'Provider prescriptions retrieved successfully' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  async getByProvider(
    @Param('providerId', ParseUUIDPipe) providerId: string,
    @CurrentUser() user: any,
  ) {
    return await this.prescriptionService.getPrescriptionsByProvider(providerId, user.userId, user.role);
  }

  @Get('pending/prescriptions')
  @Roles('pharmacist', 'admin')
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: 'Get pending prescriptions' })
  @ApiResponse({ status: 200, description: 'Pending prescriptions retrieved successfully' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  async getPendingPrescriptions(@CurrentUser() user: any) {
    return await this.prescriptionService.getPendingPrescriptions(user.userId, user.role);
  }

  @Get('statistics/overview')
  @Roles('admin', 'pharmacist')
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: 'Get prescription statistics' })
  @ApiResponse({ status: 200, description: 'Prescription statistics retrieved successfully' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  async getStatistics(@CurrentUser() user: any) {
    return await this.prescriptionService.getPrescriptionStatistics(user.userId, user.role);
  }

  @Get('history/patient/:patientId/medication/:medicationName')
  @ApiOperation({ summary: 'Get prescription history for a specific medication' })
  @ApiResponse({ status: 200, description: 'Prescription history retrieved successfully' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  async getPrescriptionHistory(
    @Param('patientId', ParseUUIDPipe) patientId: string,
    @Param('medicationName') medicationName: string,
    @CurrentUser() user: any,
  ) {
    return await this.prescriptionService.getPrescriptionHistory(patientId, medicationName, user.userId, user.role);
  }

  @Post('check-interactions')
  @Roles('provider', 'pharmacist', 'admin')
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: 'Check drug interactions' })
  @ApiResponse({ status: 200, description: 'Drug interactions checked successfully' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  async checkDrugInteractions(
    @Body('medicationIds') medicationIds: string[],
    @CurrentUser() user: any,
  ) {
    return await this.prescriptionService.checkDrugInteractions(medicationIds);
  }

  @Post('check-allergies')
  @Roles('provider', 'pharmacist', 'admin')
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: 'Check medication allergies' })
  @ApiResponse({ status: 200, description: 'Medication allergies checked successfully' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  async checkAllergies(
    @Body('patientId') patientId: string,
    @Body('medicationName') medicationName: string,
    @CurrentUser() user: any,
  ) {
    return await this.prescriptionService.checkAllergies(patientId, medicationName);
  }
}
