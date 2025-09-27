import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { BullModule } from '@nestjs/bull';
import { CacheModule } from '@nestjs/cache-manager';
import { HttpModule } from '@nestjs/axios';
import { JwtModule } from '@nestjs/jwt';
import * as redisStore from 'cache-manager-redis-store';

// Entities
import { Appointment } from './entities/appointment.entity';
import { AppointmentSlot } from './entities/appointment-slot.entity';
import { AppointmentType } from './entities/appointment-type.entity';
import { Waitlist } from './entities/waitlist.entity';
import { RecurringAppointment } from './entities/recurring-appointment.entity';
import { AppointmentReminder } from './entities/appointment-reminder.entity';

// Controllers
import { AppointmentController } from './controllers/appointment.controller';
import { SlotController } from './controllers/slot.controller';
import { WaitlistController } from './controllers/waitlist.controller';
import { CalendarController } from './controllers/calendar.controller';

// Services
import { AppointmentService } from './services/appointment.service';
import { SlotService } from './services/slot.service';
import { WaitlistService } from './services/waitlist.service';
import { CalendarService } from './services/calendar.service';
import { ReminderService } from './services/reminder.service';
import { ConflictResolver } from './services/conflict-resolver.service';

// Processors
import { AppointmentProcessor } from './processors/appointment.processor';
import { ReminderProcessor } from './processors/reminder.processor';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT, 10) || 5432,
      username: process.env.DB_USERNAME || 'kiorex_user',
      password: process.env.DB_PASSWORD || 'kiorex_password',
      database: process.env.DB_NAME || 'kiorex_appointments',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: process.env.NODE_ENV === 'development',
      logging: process.env.NODE_ENV === 'development',
    }),
    TypeOrmModule.forFeature([
      Appointment,
      AppointmentSlot,
      AppointmentType,
      Waitlist,
      RecurringAppointment,
      AppointmentReminder,
    ]),
    CacheModule.register({
      store: redisStore,
      host: process.env.REDIS_HOST || 'localhost',
      port: parseInt(process.env.REDIS_PORT, 10) || 6379,
      ttl: 300, // 5 minutes
    }),
    ClientsModule.register([
      {
        name: 'KAFKA_SERVICE',
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: 'appointment-service',
            brokers: [process.env.KAFKA_BROKER || 'localhost:9092'],
          },
          consumer: {
            groupId: 'appointment-service-consumer',
          },
        },
      },
      {
        name: 'USER_SERVICE',
        transport: Transport.TCP,
        options: {
          host: process.env.USER_SERVICE_HOST || 'user-service',
          port: parseInt(process.env.USER_SERVICE_PORT, 10) || 3002,
        },
      },
      {
        name: 'NOTIFICATION_SERVICE',
        transport: Transport.TCP,
        options: {
          host: process.env.NOTIFICATION_SERVICE_HOST || 'notification-service',
          port: parseInt(process.env.NOTIFICATION_SERVICE_PORT, 10) || 3006,
        },
      },
    ]),
    BullModule.registerQueue(
      {
        name: 'appointment-queue',
        redis: {
          host: process.env.REDIS_HOST || 'localhost',
          port: parseInt(process.env.REDIS_PORT, 10) || 6379,
        },
      },
      {
        name: 'reminder-queue',
        redis: {
          host: process.env.REDIS_HOST || 'localhost',
          port: parseInt(process.env.REDIS_PORT, 10) || 6379,
        },
      },
    ),
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'your-jwt-secret',
      signOptions: { expiresIn: process.env.JWT_EXPIRES_IN || '24h' },
    }),
    HttpModule,
  ],
  controllers: [
    AppointmentController,
    SlotController,
    WaitlistController,
    CalendarController,
  ],
  providers: [
    AppointmentService,
    SlotService,
    WaitlistService,
    CalendarService,
    ReminderService,
    ConflictResolver,
    AppointmentProcessor,
    ReminderProcessor,
  ],
  exports: [AppointmentService, SlotService],
})
export class AppointmentModule {}
