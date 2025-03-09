import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Transport } from '@nestjs/microservices';
import { RabbitAuthMQ } from './common/constants';
import * as dotenv from 'dotenv';
dotenv.config();


async function bootstrap() {
  const rabbitMQConfig = RabbitAuthMQ();

  const app = await NestFactory.createMicroservice(AppModule, {
    transport: Transport.RMQ,
    options: {
      urls: [rabbitMQConfig.url],
      queue: rabbitMQConfig.AuthQueue,
      queueOptions: { durable: true },
    },
  });

  await app.listen();
  console.log('✅: Microservice Auth is listening');
}

bootstrap();
