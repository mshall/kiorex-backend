import { Module } from '@nestjs/common';
import { AppointmentModule } from './appointment.module';

@Module({
  imports: [AppointmentModule],
})
export class AppModule {}
