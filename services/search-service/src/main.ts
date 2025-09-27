import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { SearchModule } from './search.module';

async function bootstrap() {
  const app = await NestFactory.create(SearchModule);
  
  app.enableCors();
  app.useGlobalPipes(new ValidationPipe());

  const config = new DocumentBuilder()
    .setTitle('Search Service API')
    .setDescription('Search microservice for Kiorex healthcare platform')
    .setVersion('1.0')
    .build();
  
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.KAFKA,
    options: {
      client: {
        clientId: 'search-service',
        brokers: [process.env.KAFKA_BROKER || 'localhost:9092'],
      },
      consumer: {
        groupId: 'search-service-consumer',
      },
    },
  });

  await app.startAllMicroservices();

  const port = process.env.PORT || 3008;
  await app.listen(port);
  
  console.log(`Search Service is running on port ${port}`);
}

bootstrap();
