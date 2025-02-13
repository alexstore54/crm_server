import { Global, Module } from '@nestjs/common';
import { WinstonModule } from 'nest-winston';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { configKeys } from '@/common/config';
import winston from 'winston';
import { AppLoggerService } from '@/modules/logger/services/logger.service';
import { LogLevel } from '@prisma/client';
import { LogsRepository } from '@/modules/logger/repositories';
import { LogsController } from '@/modules/logger/controllers/logs.controller';
import { LogsService } from '@/modules/logger/services';

export const APP_LOGGER_SERVICE = 'APP_LOGGER_SERVICE';

@Global()
@Module({
  imports: [
    ConfigModule,
    WinstonModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const logLevel = configService.get<string>(
          configKeys.LOG_LEVEL, LogLevel.INFO,
        );

        return {
          transports: [
            new winston.transports.Console({
              level: logLevel,
              format: winston.format.combine(winston.format.json()),
            }),
          ],
        };
      },
    }),
  ],
  providers: [
    LogsRepository,
    LogsService,
    {
      provide: APP_LOGGER_SERVICE,
      useClass: AppLoggerService,
    },
    {
      provide: 'CONTEXT', // Register the context as a provider
      useValue: 'DefaultContext', // Provide a default value
    },
  ],
  controllers: [LogsController],
  exports: [APP_LOGGER_SERVICE, 'CONTEXT'],
})
export class AppLoggerModule {

}