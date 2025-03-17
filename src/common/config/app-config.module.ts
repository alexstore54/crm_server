import { DynamicModule, Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigModuleOptions, ConfigService } from '@nestjs/config';
import { AppLoggerModule } from '@/modules/logger/logger.module';
import { AppLoggerService } from '@/modules/logger/services/logger.service';
import { RedisModule, RedisModuleOptions } from '@liaoliaots/nestjs-redis';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import {
  AgentAccessTokenStrategy,
  AgentRefreshTokenStrategy,
  CustomerAccessTokenStrategy,
  CustomerRefreshTokenStrategy,
} from '@/common/strategies/jwt';
import { REDIS_CONFIG } from '@/shared/constants/config';
import { ValidationModule, ValidationService } from '@/shared/services/validation';
import { AgentRefreshGuard } from '@/common/guards/tokens/agent';
import { configKeys } from '@/shared/schemas';

export type CommonModuleOptions = {
  config: ConfigModuleOptions;
};

@Global()
@Module({})
export class AppConfigModule {
  static register(options: CommonModuleOptions): DynamicModule {
    return {
      global: true,
      module: AppConfigModule,
      imports: [
        //Libraries and logger
        AppLoggerModule,
        ConfigModule.forRoot({
          ...options.config,
          isGlobal: true,
        }),
        RedisModule.forRootAsync({
          imports: [ConfigModule],
          inject: [ConfigService],
          //@ts-ignore
          useFactory: (configService: ConfigService): RedisModuleOptions => ({
            config: [
              {
                host: configService.get<string>('REDIS_HOST'),
                port: configService.get<number>('REDIS_PORT'),
                db: REDIS_CONFIG.SESSIONS.DB,
                namespace: REDIS_CONFIG.SESSIONS.NAMESPACE,
              },
              {
                host: configService.get<string>('REDIS_HOST'),
                port: configService.get<number>('REDIS_PORT'),
                db: REDIS_CONFIG.PERMISSIONS.DB,
                namespace: REDIS_CONFIG.PERMISSIONS.NAMESPACE,
              },
            ],
          }),
        }),
        JwtModule.registerAsync({
          imports: [ConfigModule],
          inject: [ConfigService],
          useFactory: (configService: ConfigService) => ({
            secret: configService.get<string>(configKeys.JWT_SECRET),
            global: true,
          }),
        }),
        PassportModule.register({
          defaultStrategy: 'jwt',
          session: false,
          global: true,
        }),
        ValidationModule,
      ],
      providers: [
        //services
        AppLoggerService,
        //Strategies
        AgentAccessTokenStrategy,
        AgentRefreshTokenStrategy,
        CustomerAccessTokenStrategy,
        CustomerRefreshTokenStrategy,
        ValidationService,
      ],
      exports: [ConfigModule],
    };
  }
}
