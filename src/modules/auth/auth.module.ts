import { Module } from '@nestjs/common';
import { AuthGoogleService, AuthService } from '@/modules/auth/services';
import { AuthController, AuthGoogleController, SessionsController } from '@/modules/auth/controllers';
import { AuthGateway } from '@/modules/auth/geateway';
import { GatewayModule } from '@/shared/gateway';
import { SessionsModule } from '@/shared/services';
import { SessionsService } from '@/shared/services/sessions/sessions.service';

@Module({
  imports: [GatewayModule, SessionsModule],
  controllers: [AuthController, AuthGoogleController, SessionsController],
  providers: [AuthService, AuthGoogleService, SessionsService, AuthGateway],
})
export class AuthModule {}