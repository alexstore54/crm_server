import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppConfigModule, validationSchema } from '@/common/config';
import { PrismaModule } from '@/shared/db/prisma';
import { HealthModule } from '@/modules/health/health.module';
import { CsrfMiddleware } from '@/common/middleware';
import { GatewayModule } from '@/shared/gateway';


@Module({
  imports: [
    AppConfigModule.register({
      config: { validationSchema },
    }),
    PrismaModule,
    HealthModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(CsrfMiddleware).forRoutes('/*');
  }
}
