import { Module } from '@nestjs/common';
import { AuthGoogleService, AuthService, SessionsService } from '@/modules/auth/services';
import { AuthController, AuthGoogleController } from '@/modules/auth/controllers';

@Module({
  controllers: [AuthController, AuthGoogleController],
  providers: [AuthService, AuthGoogleService, SessionsService],
})
export class AuthModule {}