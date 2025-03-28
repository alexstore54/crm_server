import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppConfigModule } from '@/common/config';
import { PrismaModule } from '@/shared/db/prisma';
import { HealthModule } from '@/modules/health/health.module';
import { CsrfMiddleware, FileLockerMiddleware } from '@/common/middleware';
import { LeadModule } from '@/modules/lead/lead.module';
import { AuthModule } from '@/modules/auth/auth.module';
import { GatewayModule } from '@/shared/gateway';
import { validationSchema } from '@/shared/schemas';
import { AgentModule } from '@/modules/agent/agent.module';
import { PermissionModule } from '@/modules/permissions/permission.module';
import { TeamModule } from '@/modules/team/team.module';
import { SessionsModule } from '@/modules/sessions/sessions.module';
import { MediaModule } from '@/modules/media';
import { RoleModule } from '@/modules/role/role.module';
import { DeskModule } from '@/modules/desk/desk.module';

@Module({
  imports: [
    AppConfigModule.register({
      config: { validationSchema },
    }),
    HealthModule,
    GatewayModule,
    AuthModule,
    LeadModule,
    AgentModule,
    PermissionModule,
    TeamModule,
    SessionsModule,
    MediaModule,
    RoleModule,
    DeskModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(CsrfMiddleware).forRoutes('/*');
    consumer.apply(FileLockerMiddleware).forRoutes('/public/*');
  }
}
