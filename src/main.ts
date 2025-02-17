import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AppExceptionFilter } from '@/common/filters';
import { AppLoggingInterceptor } from '@/common/interceptors';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { configKeys } from '@/common/config';
import { AppLoggerService } from '@/modules/logger/services';
import cookieParser from 'cookie-parser';


async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const logger = app.get(AppLoggerService);
  const config = app.get(ConfigService);

  app.enableCors({
    origin: config.get<string>(configKeys.CORS_ORIGIN),
  });
  app.use(cookieParser());
  app.useGlobalFilters(new AppExceptionFilter(logger));
  app.useGlobalInterceptors(new AppLoggingInterceptor(logger));
  app.useGlobalPipes(new ValidationPipe({
    transform: true,
    whitelist: true,
    forbidNonWhitelisted: true,
  }));

  await app.listen(config.get(configKeys.APP_PORT) || 3000);
  logger.log(`Application is running on: ${await app.getUrl()}`);
}

bootstrap();
