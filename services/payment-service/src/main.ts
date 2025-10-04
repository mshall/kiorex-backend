import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Enable CORS
  app.enableCors({
    origin: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000'],
    credentials: true,
  });

  // Start HTTP server
  const port = process.env.PORT || 3004;
  await app.listen(port);
  
  console.log(`Payment Service is running on port ${port}`);
}

bootstrap();
