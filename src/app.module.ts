import { Module } from '@nestjs/common';
import { AppConfigModule, validationSchema } from '@/common/config';
import { PrismaModule } from '@/shared/db';
import { HealthModule } from '@/modules/health/health.module';
import { AuthModule } from '@/modules/auth/auth.module';


@Module({
  imports: [
    AppConfigModule.register({
      config: { validationSchema },
    }),
    PrismaModule,
    HealthModule,
    AuthModule
  ],
})
export class AppModule {}
