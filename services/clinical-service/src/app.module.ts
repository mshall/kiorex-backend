import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ClinicalModule } from './clinical.module';
import { AppController } from './controllers/app.controller';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'default-secret',
      signOptions: { expiresIn: process.env.JWT_EXPIRES_IN || '24h' },
    }),
    ClinicalModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
