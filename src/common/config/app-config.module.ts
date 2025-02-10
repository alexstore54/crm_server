import { DynamicModule, Module } from '@nestjs/common';
import { ConfigModule, ConfigModuleOptions } from '@nestjs/config';
import { AppLoggerModule, AppLoggerService } from '@/common/config/logger';

export type CommonModuleOptions = {
  config: ConfigModuleOptions;
};

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
      ],
      providers: [AppLoggerService],
      exports: [ConfigModule, AppLoggerModule],
    };
  }
}