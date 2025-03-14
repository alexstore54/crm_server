import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { AppExceptionFilter } from '@/common/filters';
import { AppLoggingInterceptor } from '@/common/interceptors';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AppLoggerService } from '@/modules/logger/services';
import cookieParser from 'cookie-parser';
import { configKeys } from '@/shared/schemas';
import { UUIDValidationPipe } from '@/common/pipes';
import { PrismaService } from '@/shared/db/prisma';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const logger = app.get(AppLoggerService);
  const config = app.get(ConfigService);
  const prisma = new PrismaService();

  app.enableCors({
    origin: config.get<string>(configKeys.CORS_ORIGIN),
  });
  app.use(cookieParser());
  app.useGlobalFilters(new AppExceptionFilter(logger, config));
  app.useGlobalInterceptors(new AppLoggingInterceptor(logger, prisma));
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  await app.listen(config.get(configKeys.APP_PORT) || 3000);
  logger.log(`Application is running on: ${await app.getUrl()}`);
}

bootstrap();
