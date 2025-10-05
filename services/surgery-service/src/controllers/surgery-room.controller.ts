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
import { SurgeryRoomService } from '../services/surgery-room.service';
import { CreateSurgeryRoomDto } from '../dto/create-surgery-room.dto';
import { RoomStatus } from '../entities/surgery-room.entity';

@ApiTags('Surgery Rooms')
@Controller('surgery-rooms')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class SurgeryRoomController {
  constructor(private readonly surgeryRoomService: SurgeryRoomService) {}

  @Post()
  @Roles('admin')
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: 'Create new surgery room' })
  @ApiResponse({ status: 201, description: 'Surgery room created successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  async create(
    @Body(ValidationPipe) createDto: CreateSurgeryRoomDto,
    @CurrentUser() user: any,
  ) {
    return await this.surgeryRoomService.createSurgeryRoom(createDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get surgery rooms' })
  @ApiResponse({ status: 200, description: 'Surgery rooms retrieved successfully' })
  async findAll(@Query() filters: any) {
    return await this.surgeryRoomService.getSurgeryRooms(filters);
  }

  @Get('search')
  @ApiOperation({ summary: 'Search surgery rooms' })
  @ApiResponse({ status: 200, description: 'Surgery rooms search results' })
  async search(@Query('q') searchTerm: string) {
    return await this.surgeryRoomService.searchRooms(searchTerm);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get surgery room by ID' })
  @ApiResponse({ status: 200, description: 'Surgery room retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Surgery room not found' })
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    return await this.surgeryRoomService.getSurgeryRoom(id);
  }

  @Get('number/:roomNumber')
  @ApiOperation({ summary: 'Get surgery room by number' })
  @ApiResponse({ status: 200, description: 'Surgery room retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Surgery room not found' })
  async findByNumber(@Param('roomNumber') roomNumber: string) {
    return await this.surgeryRoomService.getSurgeryRoomByNumber(roomNumber);
  }

  @Put(':id')
  @Roles('admin')
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: 'Update surgery room' })
  @ApiResponse({ status: 200, description: 'Surgery room updated successfully' })
  @ApiResponse({ status: 404, description: 'Surgery room not found' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body(ValidationPipe) updateDto: Partial<CreateSurgeryRoomDto>,
    @CurrentUser() user: any,
  ) {
    return await this.surgeryRoomService.updateSurgeryRoom(id, updateDto);
  }

  @Delete(':id')
  @Roles('admin')
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: 'Delete surgery room' })
  @ApiResponse({ status: 200, description: 'Surgery room deleted successfully' })
  @ApiResponse({ status: 404, description: 'Surgery room not found' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  async remove(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: any,
  ) {
    await this.surgeryRoomService.deleteSurgeryRoom(id);
    return { message: 'Surgery room deleted successfully' };
  }

  @Get('available/rooms')
  @ApiOperation({ summary: 'Get available surgery rooms' })
  @ApiResponse({ status: 200, description: 'Available surgery rooms retrieved successfully' })
  async getAvailableRooms(
    @Query('startDate') startDate: Date,
    @Query('endDate') endDate: Date,
    @Query('roomType') roomType?: string,
  ) {
    return await this.surgeryRoomService.getAvailableRooms(startDate, endDate, roomType);
  }

  @Get('type/:type')
  @ApiOperation({ summary: 'Get surgery rooms by type' })
  @ApiResponse({ status: 200, description: 'Surgery rooms by type retrieved successfully' })
  async getByType(@Param('type') type: string) {
    return await this.surgeryRoomService.getRoomsByType(type);
  }

  @Get('status/:status')
  @ApiOperation({ summary: 'Get surgery rooms by status' })
  @ApiResponse({ status: 200, description: 'Surgery rooms by status retrieved successfully' })
  async getByStatus(@Param('status') status: RoomStatus) {
    return await this.surgeryRoomService.getRoomsByStatus(status);
  }

  @Put(':id/status')
  @Roles('admin', 'nurse')
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: 'Update room status' })
  @ApiResponse({ status: 200, description: 'Room status updated successfully' })
  @ApiResponse({ status: 404, description: 'Surgery room not found' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  async updateStatus(
    @Param('id', ParseUUIDPipe) id: string,
    @Body('status') status: RoomStatus,
    @CurrentUser() user: any,
  ) {
    return await this.surgeryRoomService.updateRoomStatus(id, status);
  }

  @Get('statistics/overview')
  @Roles('admin', 'nurse')
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: 'Get room statistics' })
  @ApiResponse({ status: 200, description: 'Room statistics retrieved successfully' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  async getStatistics(@CurrentUser() user: any) {
    return await this.surgeryRoomService.getRoomStatistics();
  }

  @Get('maintenance/needed')
  @Roles('admin', 'nurse')
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: 'Get rooms needing maintenance' })
  @ApiResponse({ status: 200, description: 'Rooms needing maintenance retrieved successfully' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  async getRoomsNeedingMaintenance(@CurrentUser() user: any) {
    return await this.surgeryRoomService.getRoomsNeedingMaintenance();
  }

  @Get('out-of-order/list')
  @Roles('admin', 'nurse')
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: 'Get rooms out of order' })
  @ApiResponse({ status: 200, description: 'Rooms out of order retrieved successfully' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  async getRoomsOutOfOrder(@CurrentUser() user: any) {
    return await this.surgeryRoomService.getRoomsOutOfOrder();
  }

  @Get('utilization/:roomId')
  @Roles('admin', 'nurse')
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: 'Get room utilization' })
  @ApiResponse({ status: 200, description: 'Room utilization retrieved successfully' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  async getRoomUtilization(
    @Param('roomId', ParseUUIDPipe) roomId: string,
    @Query('startDate') startDate: Date,
    @Query('endDate') endDate: Date,
    @CurrentUser() user: any,
  ) {
    return await this.surgeryRoomService.getRoomUtilization(roomId, startDate, endDate);
  }
}
