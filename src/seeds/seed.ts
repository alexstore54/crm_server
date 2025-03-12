// import { NestFactory } from '@nestjs/core';
// import { AppModule } from '@/app.module';
// import { SeedService } from '@/seeds/seed.service';

// async function bootstrap() {
//   const app = await NestFactory.createApplicationContext(AppModule);
//   const seedService = app.get(SeedService);
//   await seedService.seed();
//   await app.close();
// }

// bootstrap().catch((e) => {
//   console.error(e);
//   process.exit(1);
// });

import { PrismaService } from '@/shared/db/prisma';
import { AppLoggerService } from '@/modules/logger/services';
import { ConfigService } from '@nestjs/config';
import { SeedService } from './seed.service';
import winston from 'winston';

async function bootstrap() {
  // Создаем экземпляр PrismaService
  const prismaService = new PrismaService();

  // Создаем и настраиваем winston логгер
  const winstonLogger = winston.createLogger({
        level: 'info',
        format: winston.format.json(),
        transports: [
          new winston.transports.Console(),
          // можно добавить другие транспорты, если требуется
        ],
  });

  // Передаем winston логгер в AppLoggerService
  const loggerService = new AppLoggerService(winstonLogger);

  // Создаем экземпляр ConfigService
  const configService = new ConfigService();

  // Создаем экземпляр SeedService с вручную созданными зависимостями
  const seedService = new SeedService(prismaService, loggerService, configService);

  // Если требуется, инициализируем подключение к базе данных
  await prismaService.$connect();

  // Запускаем сидирование
  await seedService.seed();

  // При необходимости закрываем подключения
  await prismaService.$disconnect();
}

bootstrap().catch((err) => {
  console.error(err);
  process.exit(1);
});