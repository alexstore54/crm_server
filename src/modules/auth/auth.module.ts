import { Module } from '@nestjs/common';
import { ClientsGateway, GatewayModule, GatewayService } from '@/shared/gateway';
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
  AuthCustomerService,
  AuthGoogleService,
  AuthService,
  TokensService,
} from '@/modules/auth/services';
import { AuthGateway } from '@/modules/auth/geateway';
import { CustomersRepository } from '@/modules/users/repositories';
import { AgentRepository } from '@/modules/agents/repositories/agent.repository';
import { JwtModule, JwtService } from '@nestjs/jwt';

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
    JwtService,
    AuthService,
    AuthAgentService,
    AuthCustomerService,
    AuthGoogleService,
    TokensService,
    CustomersRepository,
    AgentRepository,
    SessionsService,
    AuthGateway,
    GatewayService,
    ClientsGateway,
  ],
})
export class AuthModule {}
