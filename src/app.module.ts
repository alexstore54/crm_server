import { Module } from '@nestjs/common';
import { AppConfigModule, validationSchema } from '@/common/config';
import { PrismaModule } from '@/shared/db/prisma';
import { HealthModule } from '@/modules/health/health.module';
import { AppRedisModule } from '@/shared/db/redis/redis.module';


@Module({
  imports: [
    AppConfigModule.register({
      config: { validationSchema },
    }),
    PrismaModule,
    AppRedisModule,
    HealthModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
