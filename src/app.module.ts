import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppConfigModule, validationSchema } from '@/common/config';
import { PrismaModule } from '@/shared/db/prisma';
import { HealthModule } from '@/modules/health/health.module';
import { CsrfMiddleware } from '@/common/middleware';
import { GatewayModule } from '@/shared/gateway';
import { UserModule } from '@/modules/users/user.module';


@Module({
  imports: [
    AppConfigModule.register({
      config: { validationSchema },
    }),
    PrismaModule,
    HealthModule,
    UserModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(CsrfMiddleware).forRoutes('/*');
  }
}
