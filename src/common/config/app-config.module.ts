import { DynamicModule, Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigModuleOptions, ConfigService } from '@nestjs/config';
import { AppLoggerModule } from '@/modules/logger/logger.module';
import { AppLoggerService } from '@/modules/logger/services/logger.service';
import { RedisModule, RedisModuleOptions } from '@liaoliaots/nestjs-redis';
import { JwtModule } from '@nestjs/jwt';

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
            config: {
              host: configService.get<string>('REDIS_HOST'),
              port: configService.get<number>('REDIS_PORT'),
            },
          }),
        }),
        JwtModule.registerAsync({
          imports: [ConfigModule],
          inject: [ConfigService],
          useFactory: (configService: ConfigService) => ({
            secret: configService.get<string>('JWT_SECRET'),
            global: true,
          }),
        }),
      ],
      providers: [AppLoggerService],
      exports: [ConfigModule],
    };
  }
}
