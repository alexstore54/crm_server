import { Module } from '@nestjs/common';
import { AuthGoogleService, AuthService, SessionsService } from '@/modules/auth/services';
import { AuthController, AuthGoogleController, SessionsController } from '@/modules/auth/controllers';
import { AuthGateway } from '@/modules/auth/geateway';

@Module({
  controllers: [AuthController, AuthGoogleController, SessionsController],
  providers: [AuthService, AuthGoogleService, SessionsService, AuthGateway],
})
export class AuthModule {}