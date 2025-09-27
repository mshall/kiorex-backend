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
import { LabResultService } from '../services/lab-result.service';
import { CreateLabResultDto } from '../dto/create-lab-result.dto';

@ApiTags('Lab Results')
@Controller('lab-results')
@UseGuards(JwtAuthGuard)
export class LabResultController {
  constructor(private readonly labResultService: LabResultService) {}

  @Post()
  @Roles('provider', 'admin')
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: 'Create lab result' })
  @ApiResponse({ status: 201, description: 'Lab result created successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  async create(
    @Body(ValidationPipe) createDto: CreateLabResultDto,
    @CurrentUser() user: any,
  ) {
    return await this.labResultService.createLabResult(createDto, user.userId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get lab result by ID' })
  @ApiResponse({ status: 200, description: 'Lab result retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Lab result not found' })
  async findOne(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: any,
  ) {
    return await this.labResultService.getLabResult(id, user.userId, user.roles[0]);
  }

  @Get('patient/:patientId')
  @ApiOperation({ summary: 'Get patient lab results' })
  @ApiResponse({ status: 200, description: 'Patient lab results retrieved successfully' })
  async getPatientLabResults(
    @Param('patientId', ParseUUIDPipe) patientId: string,
    @Query() filters: any,
    @CurrentUser() user: any,
  ) {
    return await this.labResultService.getPatientLabResults(
      patientId,
      user.userId,
      user.roles[0],
      filters,
    );
  }

  @Put(':id')
  @Roles('provider', 'admin')
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
    return await this.labResultService.updateLabResult(
      id,
      updateDto,
      user.userId,
      user.roles[0],
    );
  }

  @Post(':id/interpret')
  @Roles('provider', 'admin')
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: 'Add interpretation to lab result' })
  @ApiResponse({ status: 200, description: 'Interpretation added successfully' })
  @ApiResponse({ status: 404, description: 'Lab result not found' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  async addInterpretation(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() interpretationDto: { interpretation: string; clinicalSignificance?: string },
    @CurrentUser() user: any,
  ) {
    return await this.labResultService.addInterpretation(
      id,
      interpretationDto,
      user.userId,
    );
  }
}
