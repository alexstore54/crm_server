import { Module } from '@nestjs/common';
import { ClientsGateway, GatewayModule, GatewayService } from '@/shared/gateway';
import { AgentModule } from '@/modules/agent/agent.module';
import { UserModule } from '@/modules/user/user.module';
import {
  AuthAgentController,
  AuthController,
  AuthCustomerController,
  AuthGoogleController,
} from '@/modules/auth/controllers';
import {
  AuthAgentService,
  AuthCustomerService,
  AuthGoogleService,
  AuthService,
  TokensService,
} from '@/modules/auth/services';
import { AuthGateway } from 'modules/auth/gateways';
import { CustomersRepository, EmailRepository } from '@/modules/user/repositories';
import { AgentRepository } from '@/modules/agent/repositories/agent.repository';
import { JwtService } from '@nestjs/jwt';
import { AgentRefreshGuard } from '@/common/guards/tokens/agent';
import { CustomerRefreshGuard } from '@/common/guards/tokens/customer';
import { AuthRedisModule, AuthRedisService } from '@/shared/services/redis/auth-redis';
import { PermissionModule } from '@/modules/permissions/permission.module';
import { AgentPermissionRepository } from '@/modules/permissions/repositories';
import { AgentRefreshTokenStrategy } from '@/common/strategies/jwt';

@Module({
  imports: [GatewayModule, AuthRedisModule, AgentModule, UserModule, PermissionModule],
  controllers: [AuthController, AuthCustomerController, AuthAgentController, AuthGoogleController],
  providers: [
    //Services
    JwtService,
    AuthService,
    AuthAgentService,
    AuthCustomerService,
    AuthGoogleService,
    TokensService,
    AuthRedisService,
    //Repositories
    CustomersRepository,
    AgentRepository,
    EmailRepository,
    AgentPermissionRepository,
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
