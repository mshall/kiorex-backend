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
import { InventoryService } from './inventory.service';
import { CreateItemDto } from './dto/create-item.dto';
import { UpdateItemDto } from './dto/update-item.dto';
import { CreateStockMovementDto } from './dto/create-stock-movement.dto';
import { CreateSupplierDto } from './dto/create-supplier.dto';

@ApiTags('Inventory')
@Controller('inventory')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class InventoryController {
  constructor(private readonly inventoryService: InventoryService) {}

  // Item Management
  @Post('items')
  @Roles('admin', 'inventory_manager')
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: 'Create inventory item' })
  @ApiResponse({ status: 201, description: 'Item created successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  async createItem(@Body(ValidationPipe) createItemDto: CreateItemDto) {
    return await this.inventoryService.createItem(createItemDto);
  }

  @Get('items')
  @ApiOperation({ summary: 'Get all inventory items' })
  @ApiResponse({ status: 200, description: 'Items retrieved successfully' })
  async getItems(
    @Query() filters: {
      category?: string;
      status?: string;
      lowStock?: boolean;
      search?: string;
      page?: number;
      limit?: number;
    },
  ) {
    return await this.inventoryService.getItems(filters);
  }

  @Get('items/:id')
  @ApiOperation({ summary: 'Get item by ID' })
  @ApiResponse({ status: 200, description: 'Item retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Item not found' })
  async getItem(@Param('id', ParseUUIDPipe) id: string) {
    return await this.inventoryService.getItem(id);
  }

  @Put('items/:id')
  @Roles('admin', 'inventory_manager')
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: 'Update inventory item' })
  @ApiResponse({ status: 200, description: 'Item updated successfully' })
  @ApiResponse({ status: 404, description: 'Item not found' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  async updateItem(
    @Param('id', ParseUUIDPipe) id: string,
    @Body(ValidationPipe) updateItemDto: UpdateItemDto,
  ) {
    return await this.inventoryService.updateItem(id, updateItemDto);
  }

  @Delete('items/:id')
  @Roles('admin')
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: 'Delete inventory item' })
  @ApiResponse({ status: 200, description: 'Item deleted successfully' })
  @ApiResponse({ status: 404, description: 'Item not found' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  async deleteItem(@Param('id', ParseUUIDPipe) id: string) {
    return await this.inventoryService.deleteItem(id);
  }

  // Stock Management
  @Post('stock-movements')
  @Roles('admin', 'inventory_manager', 'nurse')
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: 'Create stock movement' })
  @ApiResponse({ status: 201, description: 'Stock movement created successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  async createStockMovement(
    @Body(ValidationPipe) createStockMovementDto: CreateStockMovementDto,
    @CurrentUser() user: any,
  ) {
    return await this.inventoryService.createStockMovement(createStockMovementDto, user.userId);
  }

  @Get('stock-movements')
  @ApiOperation({ summary: 'Get stock movements' })
  @ApiResponse({ status: 200, description: 'Stock movements retrieved successfully' })
  async getStockMovements(
    @Query() filters: {
      itemId?: string;
      type?: string;
      startDate?: Date;
      endDate?: Date;
      page?: number;
      limit?: number;
    },
  ) {
    return await this.inventoryService.getStockMovements(filters);
  }

  @Get('items/:id/stock-history')
  @ApiOperation({ summary: 'Get item stock history' })
  @ApiResponse({ status: 200, description: 'Stock history retrieved successfully' })
  async getItemStockHistory(
    @Param('id', ParseUUIDPipe) id: string,
    @Query() filters: {
      startDate?: Date;
      endDate?: Date;
    },
  ) {
    return await this.inventoryService.getItemStockHistory(id, filters);
  }

  @Get('low-stock')
  @ApiOperation({ summary: 'Get low stock items' })
  @ApiResponse({ status: 200, description: 'Low stock items retrieved successfully' })
  async getLowStockItems() {
    return await this.inventoryService.getLowStockItems();
  }

  @Get('expiring')
  @ApiOperation({ summary: 'Get expiring items' })
  @ApiResponse({ status: 200, description: 'Expiring items retrieved successfully' })
  async getExpiringItems(@Query('days') days: number = 30) {
    return await this.inventoryService.getExpiringItems(days);
  }

  // Supplier Management
  @Post('suppliers')
  @Roles('admin', 'inventory_manager')
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: 'Create supplier' })
  @ApiResponse({ status: 201, description: 'Supplier created successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  async createSupplier(@Body(ValidationPipe) createSupplierDto: CreateSupplierDto) {
    return await this.inventoryService.createSupplier(createSupplierDto);
  }

  @Get('suppliers')
  @ApiOperation({ summary: 'Get all suppliers' })
  @ApiResponse({ status: 200, description: 'Suppliers retrieved successfully' })
  async getSuppliers(
    @Query() filters: {
      status?: string;
      search?: string;
      page?: number;
      limit?: number;
    },
  ) {
    return await this.inventoryService.getSuppliers(filters);
  }

  @Get('suppliers/:id')
  @ApiOperation({ summary: 'Get supplier by ID' })
  @ApiResponse({ status: 200, description: 'Supplier retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Supplier not found' })
  async getSupplier(@Param('id', ParseUUIDPipe) id: string) {
    return await this.inventoryService.getSupplier(id);
  }

  // Reports and Analytics
  @Get('reports/stock-summary')
  @Roles('admin', 'inventory_manager')
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: 'Get stock summary report' })
  @ApiResponse({ status: 200, description: 'Stock summary retrieved successfully' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  async getStockSummary() {
    return await this.inventoryService.getStockSummary();
  }

  @Get('reports/usage-analytics')
  @Roles('admin', 'inventory_manager')
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: 'Get usage analytics' })
  @ApiResponse({ status: 200, description: 'Usage analytics retrieved successfully' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  async getUsageAnalytics(
    @Query() filters: {
      startDate?: Date;
      endDate?: Date;
      category?: string;
    },
  ) {
    return await this.inventoryService.getUsageAnalytics(filters);
  }

  @Get('reports/cost-analysis')
  @Roles('admin', 'inventory_manager')
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: 'Get cost analysis report' })
  @ApiResponse({ status: 200, description: 'Cost analysis retrieved successfully' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  async getCostAnalysis(
    @Query() filters: {
      startDate?: Date;
      endDate?: Date;
      category?: string;
    },
  ) {
    return await this.inventoryService.getCostAnalysis(filters);
  }

  // Barcode and QR Code
  @Get('items/:id/barcode')
  @ApiOperation({ summary: 'Generate barcode for item' })
  @ApiResponse({ status: 200, description: 'Barcode generated successfully' })
  async generateBarcode(@Param('id', ParseUUIDPipe) id: string) {
    return await this.inventoryService.generateBarcode(id);
  }

  @Get('items/barcode/:barcode')
  @ApiOperation({ summary: 'Get item by barcode' })
  @ApiResponse({ status: 200, description: 'Item retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Item not found' })
  async getItemByBarcode(@Param('barcode') barcode: string) {
    return await this.inventoryService.getItemByBarcode(barcode);
  }
}
