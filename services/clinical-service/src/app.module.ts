import { Module } from '@nestjs/common';
import { ClinicalModule } from './clinical.module';
import { AppController } from './controllers/app.controller';

@Module({
  imports: [ClinicalModule],
  controllers: [AppController],
})
export class AppModule {}
