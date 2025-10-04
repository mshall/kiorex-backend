import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { SearchService } from '../services/search.service';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';

@ApiTags('Search')
@Controller('search')
@UseGuards(JwtAuthGuard)
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  @Get('providers')
  @ApiOperation({ summary: 'Search healthcare providers' })
  @ApiResponse({ status: 200, description: 'Providers retrieved successfully' })
  async searchProviders(@Query() query: any) {
    return await this.searchService.searchProviders(query);
  }

  @Get('appointments')
  @ApiOperation({ summary: 'Search available appointments' })
  @ApiResponse({ status: 200, description: 'Appointments retrieved successfully' })
  async searchAppointments(@Query() query: any) {
    return await this.searchService.searchAppointments(query);
  }

  @Get('clinical-records')
  @ApiOperation({ summary: 'Search clinical records' })
  @ApiResponse({ status: 200, description: 'Clinical records retrieved successfully' })
  async searchClinicalRecords(
    @Query('patientId') patientId: string,
    @Query('query') query: string,
  ) {
    return await this.searchService.searchClinicalRecords(patientId, query);
  }

  @Get('autocomplete')
  @ApiOperation({ summary: 'Get autocomplete suggestions' })
  @ApiResponse({ status: 200, description: 'Suggestions retrieved successfully' })
  async autocomplete(
    @Query('query') query: string,
    @Query('type') type: string,
  ) {
    return await this.searchService.autocomplete(query, type);
  }
}
