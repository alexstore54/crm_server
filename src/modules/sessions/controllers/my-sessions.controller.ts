import { Controller, Delete, Get, Param, Req, UseGuards } from '@nestjs/common';
import { AgentAccessGuard } from '@/common/guards/tokens/agent';
import { AgentRequest } from '@/shared/types/auth';
import { AuthRedisService } from '@/shared/services/redis/auth-redis';
import { UUIDValidationPipe } from '@/common/pipes';
import { ENDPOINTS, RESPONSE_STATUS } from 'shared/constants/endpoints';
import { Session } from '@/shared/types/sessions';

//#TODO: Implement SOCKET
@Controller(ENDPOINTS.MY_SESSIONS.BASE)
export class MySessionsController {
  constructor(private readonly authRedisService: AuthRedisService) {}

  @UseGuards(AgentAccessGuard)
  @Get(ENDPOINTS.MY_SESSIONS.GET_ALL_MY_SESSIONS)
  async getAllMySessions(@Req() req: AgentRequest): Promise<Session[]> {
    const { user } = req;

    return this.authRedisService.getAllSessionsByUserId(user.sub);
  }

  @UseGuards(AgentAccessGuard)
  @Delete(ENDPOINTS.MY_SESSIONS.DELETE_ALL)
  async deleteAllSessions(@Req() req: AgentRequest): Promise<string> {
    const { user } = req;

    await this.authRedisService.deleteAllSessionsByUserPublicId(user.sub);
    return RESPONSE_STATUS.SUCCESS;
  }
}
