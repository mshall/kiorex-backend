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
import { CurrentUser } from '../decorators/current-user.decorator';
import { WaitlistService } from '../services/waitlist.service';
import { CreateWaitlistDto, OfferWaitlistDto } from '../dto/waitlist.dto';

@ApiTags('Waitlist')
@Controller('waitlist')
@UseGuards(JwtAuthGuard)
export class WaitlistController {
  constructor(private readonly waitlistService: WaitlistService) {}

  @Post()
  @ApiOperation({ summary: 'Join waitlist' })
  @ApiResponse({ status: 201, description: 'Added to waitlist successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  async joinWaitlist(@Body(ValidationPipe) createDto: CreateWaitlistDto) {
    return await this.waitlistService.joinWaitlist(createDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get waitlist entries' })
  @ApiResponse({ status: 200, description: 'Waitlist entries retrieved successfully' })
  async getWaitlistEntries(
    @Query('providerId') providerId?: string,
    @Query('patientId') patientId?: string,
    @Query('status') status?: string,
  ) {
    return await this.waitlistService.getWaitlistEntries(providerId, patientId, status as any);
  }

  @Post(':id/offer')
  @ApiOperation({ summary: 'Offer slot to waitlist entry' })
  @ApiResponse({ status: 200, description: 'Slot offered successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 404, description: 'Waitlist entry not found' })
  async offerSlot(
    @Param('id', ParseUUIDPipe) id: string,
    @Body(ValidationPipe) offerDto: OfferWaitlistDto,
  ) {
    return await this.waitlistService.offerSlot(id, offerDto);
  }

  @Post(':id/accept')
  @ApiOperation({ summary: 'Accept offered slot' })
  @ApiResponse({ status: 200, description: 'Slot accepted successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 404, description: 'Waitlist entry not found' })
  async acceptOffer(@Param('id', ParseUUIDPipe) id: string) {
    return await this.waitlistService.acceptOffer(id);
  }

  @Post(':id/decline')
  @ApiOperation({ summary: 'Decline offered slot' })
  @ApiResponse({ status: 200, description: 'Slot declined successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 404, description: 'Waitlist entry not found' })
  async declineOffer(@Param('id', ParseUUIDPipe) id: string) {
    return await this.waitlistService.declineOffer(id);
  }

  @Post(':id/cancel')
  @ApiOperation({ summary: 'Cancel waitlist entry' })
  @ApiResponse({ status: 200, description: 'Waitlist entry cancelled successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 404, description: 'Waitlist entry not found' })
  async cancelWaitlistEntry(@Param('id', ParseUUIDPipe) id: string) {
    return await this.waitlistService.cancelWaitlistEntry(id);
  }

  @Get('stats/:providerId')
  @ApiOperation({ summary: 'Get waitlist statistics' })
  @ApiResponse({ status: 200, description: 'Waitlist statistics retrieved successfully' })
  async getWaitlistStats(@Param('providerId', ParseUUIDPipe) providerId: string) {
    return await this.waitlistService.getWaitlistStats(providerId);
  }
}
