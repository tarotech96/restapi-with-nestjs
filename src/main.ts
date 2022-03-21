import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // register pipe to use custom validation
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true // if true validator will strip validated object
  }))
  await app.listen(3333);
}
bootstrap();
