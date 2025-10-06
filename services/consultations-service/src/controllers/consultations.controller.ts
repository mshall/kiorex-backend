import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, Request } from '@nestjs/common';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { ConsultationsService } from '../services/consultations.service';

@Controller('consultations')
@UseGuards(JwtAuthGuard)
export class ConsultationsController {
  constructor(private readonly consultationsService: ConsultationsService) {}

  @Get()
  async getAllConsultations(@Request() req) {
    return this.consultationsService.getAllConsultations(req.user);
  }

  @Get(':id')
  async getConsultationById(@Param('id') id: string, @Request() req) {
    return this.consultationsService.getConsultationById(id, req.user);
  }

  @Post()
  async createConsultation(@Body() createConsultationDto: any, @Request() req) {
    return this.consultationsService.createConsultation(createConsultationDto, req.user);
  }

  @Put(':id')
  async updateConsultation(@Param('id') id: string, @Body() updateConsultationDto: any, @Request() req) {
    return this.consultationsService.updateConsultation(id, updateConsultationDto, req.user);
  }

  @Delete(':id')
  async deleteConsultation(@Param('id') id: string, @Request() req) {
    return this.consultationsService.deleteConsultation(id, req.user);
  }

  @Post(':id/start')
  async startConsultation(@Param('id') id: string, @Request() req) {
    return this.consultationsService.startConsultation(id, req.user);
  }

  @Post(':id/complete')
  async completeConsultation(@Param('id') id: string, @Request() req) {
    return this.consultationsService.completeConsultation(id, req.user);
  }

  @Get('health')
  async healthCheck() {
    return { status: 'ok', service: 'consultations-service', timestamp: new Date().toISOString() };
  }
}
