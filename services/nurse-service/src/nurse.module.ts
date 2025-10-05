import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { NurseShift } from './entities/nurse-shift.entity';
import { PatientCare } from './entities/patient-care.entity';
import { NurseNotes } from './entities/nurse-notes.entity';
import { NurseSchedule } from './entities/nurse-schedule.entity';
import { NurseShiftService } from './services/nurse-shift.service';
import { PatientCareService } from './services/patient-care.service';
import { NurseNotesService } from './services/nurse-notes.service';
import { NurseShiftController } from './controllers/nurse-shift.controller';
import { PatientCareController } from './controllers/patient-care.controller';
import { NurseNotesController } from './controllers/nurse-notes.controller';
import { JwtStrategy } from './strategies/jwt.strategy';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forFeature([
      NurseShift,
      PatientCare,
      NurseNotes,
      NurseSchedule,
    ]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'super-secret-jwt-key-change-in-production',
      signOptions: { expiresIn: process.env.JWT_EXPIRES_IN || '15m' },
    }),
  ],
  controllers: [NurseShiftController, PatientCareController, NurseNotesController],
  providers: [NurseShiftService, PatientCareService, NurseNotesService, JwtStrategy],
  exports: [NurseShiftService, PatientCareService, NurseNotesService],
})
export class NurseModule {}
