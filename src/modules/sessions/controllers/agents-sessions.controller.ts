import { Controller, Delete, Get, Param, UseGuards } from '@nestjs/common';
import { AuthRedisService } from '@/shared/services/redis/auth-redis';
import { UUIDValidationPipe } from '@/common/pipes';
import { AgentAccessGuard } from '@/common/guards/tokens/agent';
import { PermissionsGuard } from '@/common/guards/permissions';
import { UsePermissions } from '@/common/decorators/validation';
import { ENDPOINTS_PERMISSIONS } from '@/shared/constants/permissions';
import { Session } from '@/shared/types/sessions';
import { ENDPOINTS, RESPONSE_STATUS } from 'shared/constants/endpoints';

//#TODO: Implement SOCKET
@Controller(ENDPOINTS.AGENTS_SESSIONS.BASE)
export class AgentsSessionsController {
  constructor(private readonly authRedisService: AuthRedisService) {}

  @UsePermissions(ENDPOINTS_PERMISSIONS.AGENTS_SESSIONS.GET_AGENT_SESSIONS)
  @UseGuards(AgentAccessGuard, PermissionsGuard)
  @Get(ENDPOINTS.AGENTS_SESSIONS.GET_AGENT_SESSIONS)
  async getUserSessions(
    @Param('publicId', UUIDValidationPipe) publicId: string,
  ): Promise<Session[]> {
    return await this.authRedisService.getAllSessionsByUserId(publicId);
  }

  @UsePermissions(ENDPOINTS_PERMISSIONS.AGENTS_SESSIONS.DELETE_AGENT_ALL_SESSIONS)
  @UseGuards(AgentAccessGuard, PermissionsGuard)
  @Delete(ENDPOINTS.AGENTS_SESSIONS.DELETE_ALL)
  async deleteAllUserSessions(@Param('publicId', UUIDValidationPipe) publicId: string) {
    await this.authRedisService.deleteAllSessionsByUserPublicId(publicId);
    return RESPONSE_STATUS.SUCCESS;
  }
}
