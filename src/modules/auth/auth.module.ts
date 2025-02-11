import { Module } from '@nestjs/common';
import { AuthGoogleService, AuthService } from '@/modules/auth/services';
import { AuthController, AuthGoogleController } from '@/modules/auth/controllers';

@Module({
  controllers: [AuthController, AuthGoogleController],
  providers: [AuthService, AuthGoogleService],
})
export class AuthModule {}