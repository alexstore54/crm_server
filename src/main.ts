import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AppExceptionFilter } from '@/common/filters';
import { AppLoggingInterceptor } from '@/common/interceptors';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { configKeys } from '@/common/config';
import { APP_LOGGER_SERVICE } from '@/modules/logger/logger.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const logger = app.get(APP_LOGGER_SERVICE);
  const config = app.get(ConfigService);

  app.useGlobalFilters(new AppExceptionFilter(logger));
  app.useGlobalInterceptors(new AppLoggingInterceptor(logger));
  app.useGlobalPipes(new ValidationPipe({
    transform: true,
    whitelist: true,
    forbidNonWhitelisted: true,
  }));

  await app.listen(config.get(configKeys.APP_PORT) || 3000);
}

bootstrap();
