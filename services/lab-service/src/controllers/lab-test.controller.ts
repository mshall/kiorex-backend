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
import { LabTestService } from '../services/lab-test.service';
import { CreateLabTestDto } from '../dto/create-lab-test.dto';
import { LabTestCategory, LabTestType } from '../dto/create-lab-test.dto';

@ApiTags('Lab Tests')
@Controller('lab-tests')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class LabTestController {
  constructor(private readonly labTestService: LabTestService) {}

  @Post()
  @Roles('admin', 'lab_manager')
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: 'Create new lab test' })
  @ApiResponse({ status: 201, description: 'Lab test created successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  async create(
    @Body(ValidationPipe) createDto: CreateLabTestDto,
    @CurrentUser() user: any,
  ) {
    return await this.labTestService.createLabTest(createDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get lab tests' })
  @ApiResponse({ status: 200, description: 'Lab tests retrieved successfully' })
  async findAll(@Query() filters: any) {
    return await this.labTestService.getLabTests(filters);
  }

  @Get('search')
  @ApiOperation({ summary: 'Search lab tests' })
  @ApiResponse({ status: 200, description: 'Lab tests search results' })
  async search(@Query('q') searchTerm: string) {
    return await this.labTestService.searchLabTests(searchTerm);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get lab test by ID' })
  @ApiResponse({ status: 200, description: 'Lab test retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Lab test not found' })
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    return await this.labTestService.getLabTest(id);
  }

  @Get('code/:testCode')
  @ApiOperation({ summary: 'Get lab test by code' })
  @ApiResponse({ status: 200, description: 'Lab test retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Lab test not found' })
  async findByCode(@Param('testCode') testCode: string) {
    return await this.labTestService.getLabTestByCode(testCode);
  }

  @Put(':id')
  @Roles('admin', 'lab_manager')
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: 'Update lab test' })
  @ApiResponse({ status: 200, description: 'Lab test updated successfully' })
  @ApiResponse({ status: 404, description: 'Lab test not found' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body(ValidationPipe) updateDto: Partial<CreateLabTestDto>,
    @CurrentUser() user: any,
  ) {
    return await this.labTestService.updateLabTest(id, updateDto);
  }

  @Delete(':id')
  @Roles('admin', 'lab_manager')
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: 'Delete lab test' })
  @ApiResponse({ status: 200, description: 'Lab test deleted successfully' })
  @ApiResponse({ status: 404, description: 'Lab test not found' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  async remove(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: any,
  ) {
    await this.labTestService.deleteLabTest(id);
    return { message: 'Lab test deleted successfully' };
  }

  @Get('category/:category')
  @ApiOperation({ summary: 'Get lab tests by category' })
  @ApiResponse({ status: 200, description: 'Lab tests by category retrieved successfully' })
  async getByCategory(@Param('category') category: LabTestCategory) {
    return await this.labTestService.getLabTestsByCategory(category);
  }

  @Get('specimen/:specimenType')
  @ApiOperation({ summary: 'Get lab tests by specimen type' })
  @ApiResponse({ status: 200, description: 'Lab tests by specimen type retrieved successfully' })
  async getBySpecimenType(@Param('specimenType') specimenType: LabTestType) {
    return await this.labTestService.getLabTestsBySpecimenType(specimenType);
  }

  @Get('related/:testCode')
  @ApiOperation({ summary: 'Get related lab tests' })
  @ApiResponse({ status: 200, description: 'Related lab tests retrieved successfully' })
  async getRelatedTests(@Param('testCode') testCode: string) {
    return await this.labTestService.getRelatedLabTests(testCode);
  }

  @Get('statistics/overview')
  @Roles('admin', 'lab_manager')
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: 'Get lab test statistics' })
  @ApiResponse({ status: 200, description: 'Lab test statistics retrieved successfully' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  async getStatistics(@CurrentUser() user: any) {
    return await this.labTestService.getLabTestStatistics();
  }
}
