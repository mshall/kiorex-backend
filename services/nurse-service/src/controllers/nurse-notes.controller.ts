import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
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
import { NurseNotesService } from '../services/nurse-notes.service';
import { CreateNurseNotesDto } from '../dto/create-nurse-notes.dto';

@ApiTags('Nurse Notes')
@Controller('nurse-notes')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class NurseNotesController {
  constructor(private readonly nurseNotesService: NurseNotesService) {}

  @Post()
  @Roles('nurse', 'admin')
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: 'Create new nurse notes' })
  @ApiResponse({ status: 201, description: 'Nurse notes created successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  async create(
    @Body(ValidationPipe) createDto: CreateNurseNotesDto,
    @CurrentUser() user: any,
  ) {
    return await this.nurseNotesService.createNurseNotes(createDto, user.userId);
  }

  @Get()
  @ApiOperation({ summary: 'Get nurse notes' })
  @ApiResponse({ status: 200, description: 'Nurse notes retrieved successfully' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  async findAll(
    @Query() filters: any,
    @CurrentUser() user: any,
  ) {
    return await this.nurseNotesService.getNurseNotes(user.userId, user.role, filters);
  }

  @Get('search')
  @ApiOperation({ summary: 'Search nurse notes' })
  @ApiResponse({ status: 200, description: 'Nurse notes search results' })
  async search(
    @Query('q') searchTerm: string,
    @CurrentUser() user: any,
  ) {
    return await this.nurseNotesService.searchNotes(searchTerm, user.userId, user.role);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get nurse notes by ID' })
  @ApiResponse({ status: 200, description: 'Nurse notes retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Nurse notes not found' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  async findOne(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: any,
  ) {
    return await this.nurseNotesService.getNurseNotesById(id, user.userId, user.role);
  }

  @Put(':id')
  @Roles('nurse', 'supervisor', 'admin')
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: 'Update nurse notes' })
  @ApiResponse({ status: 200, description: 'Nurse notes updated successfully' })
  @ApiResponse({ status: 404, description: 'Nurse notes not found' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body(ValidationPipe) updateDto: any,
    @CurrentUser() user: any,
  ) {
    return await this.nurseNotesService.updateNurseNotes(id, updateDto, user.userId, user.role);
  }

  @Put(':id/publish')
  @Roles('nurse', 'admin')
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: 'Publish nurse notes' })
  @ApiResponse({ status: 200, description: 'Nurse notes published successfully' })
  @ApiResponse({ status: 404, description: 'Nurse notes not found' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  async publish(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: any,
  ) {
    return await this.nurseNotesService.publishNotes(id, user.userId, user.role);
  }

  @Put(':id/review')
  @Roles('supervisor', 'admin')
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: 'Review nurse notes' })
  @ApiResponse({ status: 200, description: 'Nurse notes reviewed successfully' })
  @ApiResponse({ status: 404, description: 'Nurse notes not found' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  async review(
    @Param('id', ParseUUIDPipe) id: string,
    @Body('reviewComments') reviewComments: string,
    @CurrentUser() user: any,
  ) {
    return await this.nurseNotesService.reviewNotes(id, reviewComments, user.userId, user.role);
  }

  @Delete(':id')
  @Roles('nurse', 'supervisor', 'admin')
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: 'Delete nurse notes' })
  @ApiResponse({ status: 200, description: 'Nurse notes deleted successfully' })
  @ApiResponse({ status: 404, description: 'Nurse notes not found' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  async remove(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: any,
  ) {
    await this.nurseNotesService.deleteNurseNotes(id, user.userId, user.role);
    return { message: 'Nurse notes deleted successfully' };
  }

  @Get('patient/:patientId')
  @ApiOperation({ summary: 'Get notes by patient' })
  @ApiResponse({ status: 200, description: 'Patient notes retrieved successfully' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  async getByPatient(
    @Param('patientId', ParseUUIDPipe) patientId: string,
    @CurrentUser() user: any,
  ) {
    return await this.nurseNotesService.getNotesByPatient(patientId, user.userId, user.role);
  }

  @Get('nurse/:nurseId')
  @ApiOperation({ summary: 'Get notes by nurse' })
  @ApiResponse({ status: 200, description: 'Nurse notes retrieved successfully' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  async getByNurse(
    @Param('nurseId', ParseUUIDPipe) nurseId: string,
    @CurrentUser() user: any,
  ) {
    return await this.nurseNotesService.getNotesByNurse(nurseId, user.userId, user.role);
  }

  @Get('drafts/:nurseId')
  @ApiOperation({ summary: 'Get draft notes by nurse' })
  @ApiResponse({ status: 200, description: 'Draft notes retrieved successfully' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  async getDrafts(
    @Param('nurseId', ParseUUIDPipe) nurseId: string,
    @CurrentUser() user: any,
  ) {
    return await this.nurseNotesService.getDraftNotes(nurseId, user.userId, user.role);
  }

  @Get('pending/review')
  @Roles('supervisor', 'admin')
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: 'Get notes requiring review' })
  @ApiResponse({ status: 200, description: 'Notes requiring review retrieved successfully' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  async getNotesRequiringReview(@CurrentUser() user: any) {
    return await this.nurseNotesService.getNotesRequiringReview();
  }

  @Get('pending/follow-up')
  @ApiOperation({ summary: 'Get notes requiring follow-up' })
  @ApiResponse({ status: 200, description: 'Notes requiring follow-up retrieved successfully' })
  async getNotesRequiringFollowUp() {
    return await this.nurseNotesService.getNotesRequiringFollowUp();
  }

  @Get('statistics/overview')
  @Roles('admin', 'supervisor')
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: 'Get notes statistics' })
  @ApiResponse({ status: 200, description: 'Notes statistics retrieved successfully' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  async getStatistics(@CurrentUser() user: any) {
    return await this.nurseNotesService.getNotesStatistics(user.userId, user.role);
  }
}
