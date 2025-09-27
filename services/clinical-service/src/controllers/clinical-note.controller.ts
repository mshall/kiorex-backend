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
import { ClinicalNoteService } from '../services/clinical-note.service';
import { CreateClinicalNoteDto } from '../dto/create-clinical-note.dto';

@ApiTags('Clinical Notes')
@Controller('clinical-notes')
@UseGuards(JwtAuthGuard)
export class ClinicalNoteController {
  constructor(private readonly clinicalNoteService: ClinicalNoteService) {}

  @Post()
  @Roles('provider', 'admin')
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: 'Create clinical note' })
  @ApiResponse({ status: 201, description: 'Clinical note created successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  async create(
    @Body(ValidationPipe) createDto: CreateClinicalNoteDto,
    @CurrentUser() user: any,
  ) {
    return await this.clinicalNoteService.createClinicalNote(createDto, user.userId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get clinical note by ID' })
  @ApiResponse({ status: 200, description: 'Clinical note retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Clinical note not found' })
  async findOne(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: any,
  ) {
    return await this.clinicalNoteService.getClinicalNote(id, user.userId, user.roles[0]);
  }

  @Get('patient/:patientId')
  @ApiOperation({ summary: 'Get patient clinical notes' })
  @ApiResponse({ status: 200, description: 'Patient clinical notes retrieved successfully' })
  async getPatientClinicalNotes(
    @Param('patientId', ParseUUIDPipe) patientId: string,
    @Query() filters: any,
    @CurrentUser() user: any,
  ) {
    return await this.clinicalNoteService.getPatientClinicalNotes(
      patientId,
      user.userId,
      user.roles[0],
      filters,
    );
  }

  @Put(':id')
  @Roles('provider', 'admin')
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: 'Update clinical note' })
  @ApiResponse({ status: 200, description: 'Clinical note updated successfully' })
  @ApiResponse({ status: 404, description: 'Clinical note not found' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body(ValidationPipe) updateDto: any,
    @CurrentUser() user: any,
  ) {
    return await this.clinicalNoteService.updateClinicalNote(
      id,
      updateDto,
      user.userId,
      user.roles[0],
    );
  }

  @Post(':id/sign')
  @Roles('provider', 'admin')
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: 'Sign clinical note' })
  @ApiResponse({ status: 200, description: 'Clinical note signed successfully' })
  @ApiResponse({ status: 404, description: 'Clinical note not found' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  async sign(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: any,
  ) {
    return await this.clinicalNoteService.signClinicalNote(id, user.userId);
  }
}
