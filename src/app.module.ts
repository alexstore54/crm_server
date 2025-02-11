import { Module } from '@nestjs/common';
import { AppConfigModule, validationSchema } from '@/common/config';
import { PrismaModule } from '@/shared/db';
import { HealthModule } from '@/modules/health/health.module';


@Module({
  imports: [
    AppConfigModule.register({
      config: { validationSchema },
    }),
    PrismaModule,
    HealthModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
