import { Global, Module } from '@nestjs/common';
import { WinstonModule } from 'nest-winston';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { configKeys } from '@/common/config';
import winston from 'winston';
import { AppLoggerService } from '@/common/config/logger/logger.service';
import { LogLevel } from '@/common/config/enums';


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
    {
      provide: APP_LOGGER_SERVICE,
      useClass: AppLoggerService,
    },
    {
      provide: 'CONTEXT', // Register the context as a provider
      useValue: 'DefaultContext', // Provide a default value
    },
  ],
  exports: [APP_LOGGER_SERVICE, 'CONTEXT'],
})
export class AppLoggerModule {

}