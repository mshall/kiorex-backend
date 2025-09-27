import { Module } from '@nestjs/common';
import { ClinicalModule } from './clinical.module';

@Module({
  imports: [ClinicalModule],
})
export class AppModule {}
