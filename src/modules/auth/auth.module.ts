import { Module } from '@nestjs/common';
import { AuthGoogleService, AuthService } from '@/modules/auth/services';
import {
  AuthAgentController,
  AuthCustomerController,
  AuthGoogleController,
  SessionsController,
} from '@/modules/auth/controllers';
import { AuthGateway } from '@/modules/auth/geateway';
import { GatewayModule } from '@/shared/gateway';
import { SessionsModule } from '@/shared/services';
import { SessionsService } from '@/shared/services/sessions/sessions.service';
import { AuthAgentService } from '@/modules/auth/services/auth-agent.service';
import { TokensService } from '@/modules/auth/services/tokens.service';
import { AgentModule } from '@/modules/agents/agent.module';
import { CustomerModule } from '@/modules/customers/customer.module';

@Module({
  imports: [GatewayModule, SessionsModule, AgentModule, CustomerModule],
  controllers: [
    AuthCustomerController,
    AuthAgentController,
    AuthGoogleController,
    SessionsController,
  ],
  providers: [
    AuthService,
    AuthAgentService,
    TokensService,
    AuthGoogleService,
    SessionsService,
    AuthGateway,
  ],
})
export class AuthModule {}