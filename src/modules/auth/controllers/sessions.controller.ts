import { Controller, Delete, Get, Param } from '@nestjs/common';
import { SessionsService } from '@/modules/auth/services';


//TODO: add guards
@Controller('sessions')
export class SessionsController {
  constructor(private readonly sessionsService: SessionsService) {
  }

  @Get('users/:id')
  async getUserSessions(@Param('id') userId: string) {
    return await this.sessionsService.getAllUserSessions(userId);
  }

  @Delete('users/:id')
  async deleteUserSessions(@Param('id') userId: string) {
    return await this.sessionsService.deleteAllUserSessions(userId);
  }

}