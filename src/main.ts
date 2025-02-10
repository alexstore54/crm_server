import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AppExceptionFilter } from '@/common/filters';
import { AppLoggingInterceptor } from '@/common/interceptors';
import { APP_LOGGER_SERVICE } from '@/common/config/logger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const logger = app.get(APP_LOGGER_SERVICE);

  app.useGlobalFilters(new AppExceptionFilter(logger));
  app.useGlobalInterceptors(new AppLoggingInterceptor(logger));

  await app.listen(3000);
}
bootstrap();
