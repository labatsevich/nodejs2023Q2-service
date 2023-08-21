import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import 'dotenv/config';
import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import { join } from 'path';
import { SwaggerModule } from '@nestjs/swagger';
import { readFile } from 'fs/promises';
import { parse } from 'yaml';
import { CustomLogger } from './logger/custom-logger.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));

  const document = await readFile(join(__dirname, '../doc/api.yaml'), 'utf-8');
  SwaggerModule.setup('doc', app, parse(document));

  app.enableCors();
  const logger = app.get(CustomLogger);
  app.useLogger(logger);

  await app.listen(process.env.PORT);

  process.on('uncaughtException', (error, origin) => {
    logger.error(`Error: ${error.message} origin: ${origin}`);
    process.exit(1);
  });

  process.on('unhandledRejection', (reason) => {
    logger.error(`unhandledRejection: ${reason}`);
  });
}

bootstrap();
