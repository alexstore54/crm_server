import { Controller, Get, Param } from '@nestjs/common';
import { AuthRedisService } from '@/shared/services/redis/auth-redis';

//TODO: add guards
@Controller('sessions')
export class SessionsController {
  constructor(private readonly authRedisService: AuthRedisService) {}

  @Get('users/:id')
  async getUserSessions(@Param('id') userId: string) {
    return await this.authRedisService.getAllSessionsByUserId(userId);
  }
}
