import { Module } from '@nestjs/common';
import { ClientsGateway, GatewayModule, GatewayService } from '@/shared/gateway';
import { SessionsModule, SessionsService } from '@/shared/services';
import { AgentModule } from '@/modules/agent/agent.module';
import { UserModule } from '@/modules/user/user.module';
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
import { CustomersRepository } from '@/modules/user/repositories';
import { AgentRepository } from '@/modules/agent/repositories/agent.repository';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { AgentRefreshGuard } from '@/common/guards/tokens/agent';
import { CustomerRefreshGuard } from '@/common/guards/tokens/customer';

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
    //Services
    JwtService,
    AuthService,
    AuthAgentService,
    AuthCustomerService,
    AuthGoogleService,
    TokensService,
    SessionsService,
    //Repositories
    CustomersRepository,
    AgentRepository,
    //Gateways
    AuthGateway,
    GatewayService,
    ClientsGateway,
    //Guards
    CustomerRefreshGuard,
    AgentRefreshGuard,
  ],
})
export class AuthModule {}
