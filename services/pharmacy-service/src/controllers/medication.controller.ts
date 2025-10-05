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
import { MedicationService } from '../services/medication.service';
import { CreateMedicationDto } from '../dto/create-medication.dto';

@ApiTags('Medications')
@Controller('medications')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class MedicationController {
  constructor(private readonly medicationService: MedicationService) {}

  @Post()
  @Roles('admin', 'pharmacist')
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: 'Create new medication' })
  @ApiResponse({ status: 201, description: 'Medication created successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  async create(
    @Body(ValidationPipe) createDto: CreateMedicationDto,
    @CurrentUser() user: any,
  ) {
    return await this.medicationService.createMedication(createDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get medications' })
  @ApiResponse({ status: 200, description: 'Medications retrieved successfully' })
  async findAll(@Query() filters: any) {
    return await this.medicationService.getMedications(filters);
  }

  @Get('search')
  @ApiOperation({ summary: 'Search medications' })
  @ApiResponse({ status: 200, description: 'Medications search results' })
  async search(@Query('q') searchTerm: string) {
    return await this.medicationService.searchMedications(searchTerm);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get medication by ID' })
  @ApiResponse({ status: 200, description: 'Medication retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Medication not found' })
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    return await this.medicationService.getMedication(id);
  }

  @Get('name/:name')
  @ApiOperation({ summary: 'Get medication by name' })
  @ApiResponse({ status: 200, description: 'Medication retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Medication not found' })
  async findByName(@Param('name') name: string) {
    return await this.medicationService.getMedicationByName(name);
  }

  @Put(':id')
  @Roles('admin', 'pharmacist')
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: 'Update medication' })
  @ApiResponse({ status: 200, description: 'Medication updated successfully' })
  @ApiResponse({ status: 404, description: 'Medication not found' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body(ValidationPipe) updateDto: Partial<CreateMedicationDto>,
    @CurrentUser() user: any,
  ) {
    return await this.medicationService.updateMedication(id, updateDto);
  }

  @Delete(':id')
  @Roles('admin', 'pharmacist')
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: 'Delete medication' })
  @ApiResponse({ status: 200, description: 'Medication deleted successfully' })
  @ApiResponse({ status: 404, description: 'Medication not found' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  async remove(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: any,
  ) {
    await this.medicationService.deleteMedication(id);
    return { message: 'Medication deleted successfully' };
  }

  @Get('category/:category')
  @ApiOperation({ summary: 'Get medications by category' })
  @ApiResponse({ status: 200, description: 'Medications by category retrieved successfully' })
  async getByCategory(@Param('category') category: string) {
    return await this.medicationService.getMedicationsByCategory(category);
  }

  @Get('dosage-form/:dosageForm')
  @ApiOperation({ summary: 'Get medications by dosage form' })
  @ApiResponse({ status: 200, description: 'Medications by dosage form retrieved successfully' })
  async getByDosageForm(@Param('dosageForm') dosageForm: string) {
    return await this.medicationService.getMedicationsByDosageForm(dosageForm);
  }

  @Get('stock/low')
  @Roles('admin', 'pharmacist')
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: 'Get low stock medications' })
  @ApiResponse({ status: 200, description: 'Low stock medications retrieved successfully' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  async getLowStock(@CurrentUser() user: any) {
    return await this.medicationService.getLowStockMedications();
  }

  @Get('stock/expired')
  @Roles('admin', 'pharmacist')
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: 'Get expired medications' })
  @ApiResponse({ status: 200, description: 'Expired medications retrieved successfully' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  async getExpired(@CurrentUser() user: any) {
    return await this.medicationService.getExpiredMedications();
  }

  @Get('stock/expiring-soon')
  @Roles('admin', 'pharmacist')
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: 'Get medications expiring soon' })
  @ApiResponse({ status: 200, description: 'Medications expiring soon retrieved successfully' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  async getExpiringSoon(
    @Query('days') days: number = 30,
    @CurrentUser() user: any,
  ) {
    return await this.medicationService.getMedicationsExpiringSoon(days);
  }

  @Get('statistics/overview')
  @Roles('admin', 'pharmacist')
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: 'Get medication statistics' })
  @ApiResponse({ status: 200, description: 'Medication statistics retrieved successfully' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  async getStatistics(@CurrentUser() user: any) {
    return await this.medicationService.getMedicationStatistics();
  }

  @Put(':id/stock')
  @Roles('admin', 'pharmacist')
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: 'Update medication stock' })
  @ApiResponse({ status: 200, description: 'Medication stock updated successfully' })
  @ApiResponse({ status: 404, description: 'Medication not found' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  async updateStock(
    @Param('id', ParseUUIDPipe) id: string,
    @Body('quantity') quantity: number,
    @Body('operation') operation: 'add' | 'subtract',
    @CurrentUser() user: any,
  ) {
    return await this.medicationService.updateStock(id, quantity, operation);
  }
}
