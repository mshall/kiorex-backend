import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { Surgery } from './entities/surgery.entity';
import { SurgeryTeam } from './entities/surgery-team.entity';
import { SurgeryRoom } from './entities/surgery-room.entity';
import { SurgerySchedule } from './entities/surgery-schedule.entity';
import { SurgeryService } from './services/surgery.service';
import { SurgeryTeamService } from './services/surgery-team.service';
import { SurgeryRoomService } from './services/surgery-room.service';
import { SurgeryController } from './controllers/surgery.controller';
import { SurgeryTeamController } from './controllers/surgery-team.controller';
import { SurgeryRoomController } from './controllers/surgery-room.controller';
import { JwtStrategy } from './strategies/jwt.strategy';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forFeature([
      Surgery,
      SurgeryTeam,
      SurgeryRoom,
      SurgerySchedule,
    ]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'super-secret-jwt-key-change-in-production',
      signOptions: { expiresIn: process.env.JWT_EXPIRES_IN || '15m' },
    }),
  ],
  controllers: [SurgeryController, SurgeryTeamController, SurgeryRoomController],
  providers: [SurgeryService, SurgeryTeamService, SurgeryRoomService, JwtStrategy],
  exports: [SurgeryService, SurgeryTeamService, SurgeryRoomService],
})
export class SurgeryModule {}
