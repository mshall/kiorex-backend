import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Enable CORS
  app.enableCors();
  
  // Start HTTP server
  const port = process.env.PORT || 3013;
  await app.listen(port);
  
  console.log(`Nurse Service is running on port ${port}`);
}

bootstrap();
