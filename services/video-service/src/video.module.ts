import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { VideoSession } from './entities/video-session.entity';
import { VideoParticipant } from './entities/video-participant.entity';
import { VideoService } from './services/video.service';
import { TwilioVideoService } from './services/twilio-video.service';
import { VideoController } from './controllers/video.controller';
import { JwtStrategy } from './strategies/jwt.strategy';
import { RolesGuard } from './guards/roles.guard';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forFeature([VideoSession, VideoParticipant]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'super-secret-jwt-key-change-in-production',
      signOptions: { expiresIn: process.env.JWT_EXPIRES_IN || '15m' },
    }),
  ],
  providers: [VideoService, TwilioVideoService, JwtStrategy, RolesGuard],
  controllers: [VideoController],
  exports: [VideoService],
})
export class VideoModule {}