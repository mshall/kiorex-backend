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
import { SlotService } from '../services/slot.service';
import { CreateSlotDto, BulkCreateSlotsDto } from '../dto/create-slot.dto';

@ApiTags('Slots')
@Controller('slots')
@UseGuards(JwtAuthGuard)
export class SlotController {
  constructor(private readonly slotService: SlotService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new slot' })
  @ApiResponse({ status: 201, description: 'Slot created successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  async create(@Body(ValidationPipe) createDto: CreateSlotDto) {
    return await this.slotService.createSlot(createDto);
  }

  @Post('bulk')
  @ApiOperation({ summary: 'Create multiple slots' })
  @ApiResponse({ status: 201, description: 'Slots created successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  async createBulk(@Body(ValidationPipe) bulkCreateDto: BulkCreateSlotsDto) {
    return await this.slotService.createBulkSlots(bulkCreateDto);
  }

  @Get('available')
  @ApiOperation({ summary: 'Get available slots' })
  @ApiResponse({ status: 200, description: 'Available slots retrieved successfully' })
  async getAvailable(
    @Query('providerId') providerId: string,
    @Query('startDate') startDate: Date,
    @Query('endDate') endDate: Date,
    @Query('appointmentTypeId') appointmentTypeId?: string,
  ) {
    return await this.slotService.getAvailableSlots(
      providerId,
      startDate,
      endDate,
      appointmentTypeId,
    );
  }

  @Post('block')
  @ApiOperation({ summary: 'Block slots' })
  @ApiResponse({ status: 200, description: 'Slots blocked successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  async blockSlots(
    @Body() blockDto: {
      providerId: string;
      startTime: Date;
      endTime: Date;
      reason?: string;
    },
  ) {
    return await this.slotService.blockSlots(
      blockDto.providerId,
      blockDto.startTime,
      blockDto.endTime,
      blockDto.reason,
    );
  }

  @Put(':id/release')
  @ApiOperation({ summary: 'Release a blocked slot' })
  @ApiResponse({ status: 200, description: 'Slot released successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 404, description: 'Slot not found' })
  async releaseSlot(@Param('id', ParseUUIDPipe) id: string) {
    return await this.slotService.releaseSlot(id);
  }

  @Get('schedule/:providerId')
  @ApiOperation({ summary: 'Get provider schedule for a specific date' })
  @ApiResponse({ status: 200, description: 'Provider schedule retrieved successfully' })
  async getProviderSchedule(
    @Param('providerId', ParseUUIDPipe) providerId: string,
    @Query('date') date: Date,
  ) {
    return await this.slotService.getProviderSchedule(providerId, date);
  }
}
