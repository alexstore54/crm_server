import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppConfigModule } from '@/common/config';
import { PrismaModule } from '@/shared/db/prisma';
import { HealthModule } from '@/modules/health/health.module';
import { CsrfMiddleware } from '@/common/middleware';
import { UserModule } from '@/modules/user/user.module';
import { AuthModule } from '@/modules/auth/auth.module';
import { GatewayModule } from '@/shared/gateway';
import { validationSchema } from '@/shared/schemas';
import { AgentModule } from '@/modules/agent/agent.module';
import { PermissionModule } from '@/modules/permissions/permission.module';
import { SeedModule } from '@/seeds/seed.module';
import { TeamModule } from '@/modules/team/team.module';

@Module({
  imports: [
    AppConfigModule.register({
      config: { validationSchema },
    }),
    PrismaModule,
    HealthModule,
    GatewayModule,
    AuthModule,
    UserModule,
    AgentModule,
    PermissionModule,
    SeedModule,
    TeamModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(CsrfMiddleware).forRoutes('/*');
  }
}
