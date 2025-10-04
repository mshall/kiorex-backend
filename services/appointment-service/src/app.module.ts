import { Module } from '@nestjs/common';
import { AppointmentModule } from './appointment.module';
import { AppController } from './controllers/app.controller';

@Module({
  imports: [AppointmentModule],
  controllers: [AppController],
})
export class AppModule {}
