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
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { RolesGuard } from '../guards/roles.guard';
import { Roles } from '../decorators/roles.decorator';
import { CurrentUser } from '../decorators/current-user.decorator';
import { InventoryService } from '../services/inventory.service';
import { CreateInventoryDto } from '../dto/create-inventory.dto';

@ApiTags('Inventory')
@Controller('inventory')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class InventoryController {
  constructor(private readonly inventoryService: InventoryService) {}

  @Post()
  @Roles('admin', 'pharmacist')
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: 'Create new inventory transaction' })
  @ApiResponse({ status: 201, description: 'Inventory transaction created successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  async create(
    @Body(ValidationPipe) createDto: CreateInventoryDto,
    @CurrentUser() user: any,
  ) {
    return await this.inventoryService.createInventoryTransaction(createDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get inventory transactions' })
  @ApiResponse({ status: 200, description: 'Inventory transactions retrieved successfully' })
  async findAll(@Query() filters: any) {
    return await this.inventoryService.getInventoryTransactions(filters);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get inventory transaction by ID' })
  @ApiResponse({ status: 200, description: 'Inventory transaction retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Inventory transaction not found' })
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    return await this.inventoryService.getInventoryTransaction(id);
  }

  @Get('medication/:medicationId')
  @ApiOperation({ summary: 'Get inventory transactions by medication' })
  @ApiResponse({ status: 200, description: 'Medication inventory transactions retrieved successfully' })
  async getByMedication(@Param('medicationId', ParseUUIDPipe) medicationId: string) {
    return await this.inventoryService.getInventoryByMedication(medicationId);
  }

  @Get('stock/:medicationId')
  @ApiOperation({ summary: 'Get current stock for medication' })
  @ApiResponse({ status: 200, description: 'Current stock retrieved successfully' })
  async getCurrentStock(@Param('medicationId', ParseUUIDPipe) medicationId: string) {
    const stock = await this.inventoryService.getCurrentStock(medicationId);
    return { medicationId, currentStock: stock };
  }

  @Get('statistics/overview')
  @Roles('admin', 'pharmacist')
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: 'Get inventory statistics' })
  @ApiResponse({ status: 200, description: 'Inventory statistics retrieved successfully' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  async getStatistics(@CurrentUser() user: any) {
    return await this.inventoryService.getInventoryStatistics();
  }

  @Get('stock/low')
  @Roles('admin', 'pharmacist')
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: 'Get low stock medications' })
  @ApiResponse({ status: 200, description: 'Low stock medications retrieved successfully' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  async getLowStock(@CurrentUser() user: any) {
    return await this.inventoryService.getLowStockMedications();
  }

  @Get('stock/expired')
  @Roles('admin', 'pharmacist')
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: 'Get expired medications' })
  @ApiResponse({ status: 200, description: 'Expired medications retrieved successfully' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  async getExpired(@CurrentUser() user: any) {
    return await this.inventoryService.getExpiredMedications();
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
    return await this.inventoryService.getMedicationsExpiringSoon(days);
  }

  @Get('value/total')
  @Roles('admin', 'pharmacist')
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: 'Get total inventory value' })
  @ApiResponse({ status: 200, description: 'Total inventory value retrieved successfully' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  async getInventoryValue(@CurrentUser() user: any) {
    const value = await this.inventoryService.getInventoryValue();
    return { totalValue: value };
  }

  @Get('turnover/:medicationId')
  @Roles('admin', 'pharmacist')
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: 'Get inventory turnover for medication' })
  @ApiResponse({ status: 200, description: 'Inventory turnover retrieved successfully' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  async getInventoryTurnover(
    @Param('medicationId', ParseUUIDPipe) medicationId: string,
    @Query('days') days: number = 30,
    @CurrentUser() user: any,
  ) {
    const turnover = await this.inventoryService.getInventoryTurnover(medicationId, days);
    return { medicationId, turnover, period: days };
  }

  @Get('report/period')
  @Roles('admin', 'pharmacist')
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: 'Get inventory report for period' })
  @ApiResponse({ status: 200, description: 'Inventory report retrieved successfully' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  async getInventoryReport(
    @Query('startDate') startDate: Date,
    @Query('endDate') endDate: Date,
    @CurrentUser() user: any,
  ) {
    return await this.inventoryService.getInventoryReport(startDate, endDate);
  }
}
