import { Module } from '@nestjs/common';
import { AuthGoogleService, AuthService } from '@/modules/auth/services';
import {
  AuthAgentController,
  AuthGoogleController,
  AuthUserController,
  SessionsController,
} from '@/modules/auth/controllers';
import { AuthGateway } from '@/modules/auth/geateway';
import { GatewayModule } from '@/shared/gateway';
import { SessionsModule } from '@/shared/services';
import { SessionsService } from '@/shared/services/sessions/sessions.service';
import { AuthAgentService } from '@/modules/auth/services/auth-agent.service';

@Module({
  imports: [GatewayModule, SessionsModule],
  controllers: [AuthUserController, AuthAgentController, AuthGoogleController, SessionsController],
  providers: [AuthService, AuthAgentService ,AuthGoogleService, SessionsService, AuthGateway],
})
export class AuthModule {}