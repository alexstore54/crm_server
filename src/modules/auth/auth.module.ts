import { Module } from '@nestjs/common';
import { GatewayModule } from '@/shared/gateway';
import { SessionsModule, SessionsService } from '@/shared/services';
import { AgentModule } from '@/modules/agents/agent.module';
import { UserModule } from '@/modules/users/user.module';
import {
  AuthAgentController,
  AuthController,
  AuthCustomerController,
  AuthGoogleController,
  SessionsController,
} from '@/modules/auth/controllers';
import {
  AuthAgentService,
  AuthGoogleService,
  AuthService,
  TokensService,
} from '@/modules/auth/services';
import { AuthGateway } from '@/modules/auth/geateway';
import { CustomersRepository } from '@/modules/users/repositories';
import { AgentRepository } from '@/modules/agents/repositories/agent.repository';

@Module({
  imports: [GatewayModule, SessionsModule, AgentModule, UserModule],
  controllers: [
    AuthController,
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
    CustomersRepository,
    AgentRepository,
  ],
})
export class AuthModule {}