import { Controller, Post, Get, Body, Param, UseGuards } from '@nestjs/common';
import { VideoService } from '../services/video.service';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { RolesGuard } from '../guards/roles.guard';
import { Roles } from '../decorators/roles.decorator';
import { CurrentUser } from '../decorators/current-user.decorator';

@Controller('video')
@UseGuards(JwtAuthGuard)
export class VideoController {
  constructor(private videoService: VideoService) {}

  @Post('sessions')
  @UseGuards(RolesGuard)
  @Roles('doctor', 'admin')
  async createSession(
    @Body() data: {
      appointmentId: string;
      hostId: string;
      participantIds: string[];
      scheduledStart: Date;
      scheduledEnd: Date;
    },
  ) {
    return this.videoService.createSession(data);
  }

  @Post('sessions/:id/join')
  async joinSession(
    @Param('id') sessionId: string,
    @CurrentUser('id') userId: string,
  ) {
    return this.videoService.joinSession(sessionId, userId);
  }
}
