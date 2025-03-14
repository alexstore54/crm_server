import { Global, Module } from '@nestjs/common';
import { WinstonModule } from 'nest-winston';
import { ConfigModule, ConfigService } from '@nestjs/config';
import winston from 'winston';
import { AppLoggerService } from '@/modules/logger/services/logger.service';
import { LogLevel } from '@prisma/client';
import { LogsRepository } from '@/modules/logger/repositories';
import { LogsController } from '@/modules/logger/controllers/logs.controller';
import { LogsService } from '@/modules/logger/services';
import { PrismaTransport } from '@/modules/logger/transports';
import { configKeys } from '@/shared/schemas';
import { AgentModule } from '@/modules/agent/agent.module';
import { AgentRepository } from '@/modules/agent/repositories';
import { ValidationService } from '@/shared/services/validation';
import { AuthRedisService } from '@/shared/services/redis/auth-redis';

@Global()
@Module({
  imports: [
    AgentModule,
    ConfigModule,
    WinstonModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService, LogsRepository],
      useFactory: (configService: ConfigService, logsRepository: LogsRepository) => ({
        transports: [
          new PrismaTransport(logsRepository, {
            level: (configService.get<LogLevel>(configKeys.LOG_LEVEL) ?? 'info').toLowerCase(),
          }),
          new winston.transports.Console({
            format: winston.format.combine(winston.format.timestamp(), winston.format.json()),
          }),
        ],
      }),
    }),
  ],
  providers: [
    AppLoggerService,
    LogsRepository,
    LogsService,
    AgentRepository,
    AuthRedisService,
    ValidationService,
  ],
  controllers: [LogsController],
  exports: [AppLoggerService, LogsRepository],
})
export class AppLoggerModule {}
