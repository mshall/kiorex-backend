import {
  Controller,
  Get,
  Post,
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
import { PrescriptionService } from '../services/prescription.service';
import { CreatePrescriptionDto } from '../dto/create-prescription.dto';

@ApiTags('Prescriptions')
@Controller('prescriptions')
@UseGuards(JwtAuthGuard)
export class PrescriptionController {
  constructor(private readonly prescriptionService: PrescriptionService) {}

  @Post()
  @Roles('provider')
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: 'Create prescription' })
  @ApiResponse({ status: 201, description: 'Prescription created successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  async create(
    @Body(ValidationPipe) createDto: CreatePrescriptionDto,
    @CurrentUser() user: any,
  ) {
    return await this.prescriptionService.createPrescription(createDto, user.userId);
  }

  @Post(':id/refill')
  @ApiOperation({ summary: 'Refill prescription' })
  @ApiResponse({ status: 200, description: 'Prescription refilled successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 404, description: 'Prescription not found' })
  async refill(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() refillDto: { pharmacyId?: string },
  ) {
    return await this.prescriptionService.refillPrescription(id, refillDto.pharmacyId);
  }

  @Post(':id/cancel')
  @Roles('provider', 'admin')
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: 'Cancel prescription' })
  @ApiResponse({ status: 200, description: 'Prescription cancelled successfully' })
  @ApiResponse({ status: 404, description: 'Prescription not found' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  async cancel(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() cancelDto: { reason: string },
    @CurrentUser() user: any,
  ) {
    return await this.prescriptionService.cancelPrescription(
      id,
      cancelDto.reason,
      user.userId,
    );
  }

  @Get('patient/:patientId')
  @ApiOperation({ summary: 'Get patient prescriptions' })
  @ApiResponse({ status: 200, description: 'Patient prescriptions retrieved successfully' })
  async getPatientPrescriptions(
    @Param('patientId', ParseUUIDPipe) patientId: string,
    @Query('activeOnly') activeOnly: boolean = false,
  ) {
    return await this.prescriptionService.getPatientPrescriptions(patientId, activeOnly);
  }

  @Post('check-interactions')
  @ApiOperation({ summary: 'Check drug interactions' })
  @ApiResponse({ status: 200, description: 'Drug interactions checked successfully' })
  async checkInteractions(
    @Body() checkDto: { patientId: string; medicationName: string },
  ) {
    return await this.prescriptionService.checkDrugInteractions(
      checkDto.patientId,
      checkDto.medicationName,
    );
  }

  @Get('reports/controlled-substances')
  @Roles('provider', 'admin')
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: 'Get controlled substance report' })
  @ApiResponse({ status: 200, description: 'Controlled substance report retrieved successfully' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  async getControlledSubstanceReport(
    @CurrentUser() user: any,
    @Query('startDate') startDate: Date,
    @Query('endDate') endDate: Date,
  ) {
    return await this.prescriptionService.getControlledSubstanceReport(
      user.userId,
      startDate,
      endDate,
    );
  }
}
