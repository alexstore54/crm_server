import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppConfigModule, validationSchema } from '@/common/config';
import { PrismaModule } from '@/shared/db/prisma';
import { HealthModule } from '@/modules/health/health.module';
import { CsrfMiddleware } from '@/common/middleware';
import { UserModule } from '@/modules/users/user.module';
import { AuthModule } from '@/modules/auth/auth.module';
import { GatewayModule } from '@/shared/gateway';


@Module({
  imports: [
    AppConfigModule.register({
      config: { validationSchema },
    }),
    PrismaModule,
    HealthModule,
    AuthModule,
    GatewayModule,
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
