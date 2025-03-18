import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Transport } from '@nestjs/microservices';
import { RabbitConfigMQ } from './common/constants';

async function bootstrap() {
  const app = await NestFactory.createMicroservice(AppModule, {
    transport: Transport.RMQ,
    options: {
      urls: RabbitConfigMQ().url,
      queue: RabbitConfigMQ().queue,
    },
  });
  await app.listen();
  console.log('✅: Microservice Category-Expense is listening');

}
bootstrap();
