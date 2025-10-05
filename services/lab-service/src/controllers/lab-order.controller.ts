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
import { LabOrderService } from '../services/lab-order.service';
import { CreateLabOrderDto } from '../dto/create-lab-order.dto';
import { UpdateLabOrderDto } from '../dto/update-lab-order.dto';

@ApiTags('Lab Orders')
@Controller('lab-orders')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class LabOrderController {
  constructor(private readonly labOrderService: LabOrderService) {}

  @Post()
  @Roles('provider', 'admin')
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: 'Create new lab order' })
  @ApiResponse({ status: 201, description: 'Lab order created successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  async create(
    @Body(ValidationPipe) createDto: CreateLabOrderDto,
    @CurrentUser() user: any,
  ) {
    return await this.labOrderService.createLabOrder(createDto, user.userId);
  }

  @Get()
  @ApiOperation({ summary: 'Get lab orders' })
  @ApiResponse({ status: 200, description: 'Lab orders retrieved successfully' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  async findAll(
    @Query() filters: any,
    @CurrentUser() user: any,
  ) {
    return await this.labOrderService.getLabOrders(user.userId, user.role, filters);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get lab order by ID' })
  @ApiResponse({ status: 200, description: 'Lab order retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Lab order not found' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  async findOne(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: any,
  ) {
    return await this.labOrderService.getLabOrder(id, user.userId, user.role);
  }

  @Put(':id')
  @Roles('provider', 'lab_technician', 'admin')
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: 'Update lab order' })
  @ApiResponse({ status: 200, description: 'Lab order updated successfully' })
  @ApiResponse({ status: 404, description: 'Lab order not found' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body(ValidationPipe) updateDto: UpdateLabOrderDto,
    @CurrentUser() user: any,
  ) {
    return await this.labOrderService.updateLabOrder(id, updateDto, user.userId, user.role);
  }

  @Delete(':id')
  @Roles('provider', 'admin')
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: 'Cancel lab order' })
  @ApiResponse({ status: 200, description: 'Lab order cancelled successfully' })
  @ApiResponse({ status: 404, description: 'Lab order not found' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  async cancel(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: any,
  ) {
    return await this.labOrderService.cancelLabOrder(id, user.userId, user.role);
  }

  @Get('patient/:patientId')
  @ApiOperation({ summary: 'Get lab orders by patient' })
  @ApiResponse({ status: 200, description: 'Patient lab orders retrieved successfully' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  async getByPatient(
    @Param('patientId', ParseUUIDPipe) patientId: string,
    @CurrentUser() user: any,
  ) {
    return await this.labOrderService.getLabOrdersByPatient(patientId, user.userId, user.role);
  }

  @Get('provider/:providerId')
  @ApiOperation({ summary: 'Get lab orders by provider' })
  @ApiResponse({ status: 200, description: 'Provider lab orders retrieved successfully' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  async getByProvider(
    @Param('providerId', ParseUUIDPipe) providerId: string,
    @CurrentUser() user: any,
  ) {
    return await this.labOrderService.getLabOrdersByProvider(providerId, user.userId, user.role);
  }

  @Get('pending/orders')
  @Roles('lab_technician', 'admin')
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: 'Get pending lab orders' })
  @ApiResponse({ status: 200, description: 'Pending lab orders retrieved successfully' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  async getPendingOrders(@CurrentUser() user: any) {
    return await this.labOrderService.getPendingLabOrders(user.userId, user.role);
  }

  @Get('statistics/overview')
  @Roles('admin', 'lab_manager')
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: 'Get lab order statistics' })
  @ApiResponse({ status: 200, description: 'Lab order statistics retrieved successfully' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  async getStatistics(@CurrentUser() user: any) {
    return await this.labOrderService.getLabOrderStatistics(user.userId, user.role);
  }
}
