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
import { VitalsService } from '../services/vitals.service';
import { CreateVitalsDto } from '../dto/create-vitals.dto';
import { UpdateVitalsDto } from '../dto/update-vitals.dto';

@ApiTags('Vitals')
@Controller('vitals')
@UseGuards(JwtAuthGuard)
export class VitalsController {
  constructor(private readonly vitalsService: VitalsService) {}

  @Post()
  @Roles('provider', 'nurse')
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: 'Record patient vitals' })
  @ApiResponse({ status: 201, description: 'Vitals recorded successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  async create(
    @Body(ValidationPipe) createDto: CreateVitalsDto,
    @CurrentUser() user: any,
  ) {
    return await this.vitalsService.createVitals(createDto, user.userId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get vitals by ID' })
  @ApiResponse({ status: 200, description: 'Vitals retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Vitals not found' })
  async findOne(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: any,
  ) {
    return await this.vitalsService.getVitals(id, user.userId, user.roles[0]);
  }

  @Get('patient/:patientId')
  @ApiOperation({ summary: 'Get patient vitals history' })
  @ApiResponse({ status: 200, description: 'Patient vitals retrieved successfully' })
  async getPatientVitals(
    @Param('patientId', ParseUUIDPipe) patientId: string,
    @Query() filters: {
      startDate?: Date;
      endDate?: Date;
      limit?: number;
    },
    @CurrentUser() user: any,
  ) {
    return await this.vitalsService.getPatientVitals(
      patientId,
      user.userId,
      user.roles[0],
      filters,
    );
  }

  @Put(':id')
  @Roles('provider', 'nurse')
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: 'Update vitals' })
  @ApiResponse({ status: 200, description: 'Vitals updated successfully' })
  @ApiResponse({ status: 404, description: 'Vitals not found' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body(ValidationPipe) updateDto: UpdateVitalsDto,
    @CurrentUser() user: any,
  ) {
    return await this.vitalsService.updateVitals(
      id,
      updateDto,
      user.userId,
      user.roles[0],
    );
  }

  @Get('patient/:patientId/latest')
  @ApiOperation({ summary: 'Get latest vitals for patient' })
  @ApiResponse({ status: 200, description: 'Latest vitals retrieved successfully' })
  async getLatestVitals(
    @Param('patientId', ParseUUIDPipe) patientId: string,
    @CurrentUser() user: any,
  ) {
    return await this.vitalsService.getLatestVitals(
      patientId,
      user.userId,
      user.roles[0],
    );
  }

  @Get('patient/:patientId/trends')
  @ApiOperation({ summary: 'Get vitals trends for patient' })
  @ApiResponse({ status: 200, description: 'Vitals trends retrieved successfully' })
  async getVitalsTrends(
    @Param('patientId', ParseUUIDPipe) patientId: string,
    @Query() filters: {
      startDate?: Date;
      endDate?: Date;
      vitalType?: string;
    },
    @CurrentUser() user: any,
  ) {
    return await this.vitalsService.getVitalsTrends(
      patientId,
      user.userId,
      user.roles[0],
      filters,
    );
  }

  @Get('alerts/:patientId')
  @Roles('provider', 'nurse')
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: 'Get vitals alerts for patient' })
  @ApiResponse({ status: 200, description: 'Vitals alerts retrieved successfully' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  async getVitalsAlerts(
    @Param('patientId', ParseUUIDPipe) patientId: string,
    @CurrentUser() user: any,
  ) {
    return await this.vitalsService.getVitalsAlerts(
      patientId,
      user.userId,
      user.roles[0],
    );
  }

  @Post('bulk')
  @Roles('provider', 'nurse')
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: 'Record multiple vitals entries' })
  @ApiResponse({ status: 201, description: 'Bulk vitals recorded successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  async createBulk(
    @Body() bulkDto: { vitals: CreateVitalsDto[] },
    @CurrentUser() user: any,
  ) {
    return await this.vitalsService.createBulkVitals(bulkDto.vitals, user.userId);
  }
}
