import { Body, Controller, Get, Patch, Req, UseGuards } from '@nestjs/common';
import { AgentService } from '@/modules/agent/services/agent.service';
import { AgentRequest } from '@/shared/types/auth';
import { Agent, Lead } from '@prisma/client';
import { UpdateAgent } from '@/modules/agent/dto';
import { AgentAccessGuard } from '@/common/guards/tokens/agent';
import { PermissionsGuard } from '@/common/guards/permissions';
import { UsePermissions } from '@/common/decorators/validation';
import { ENDPOINTS_PERMISSIONS } from '@/shared/constants/permissions';
import { FullAgent } from '@/shared/types/agent';
import { ENDPOINTS } from '@/shared/constants/endpoints';

@Controller(ENDPOINTS.AGENT.BASE)
export class AgentController {
  constructor(private readonly agentService: AgentService) {}

  @UseGuards(AgentAccessGuard)
  @Get(ENDPOINTS.AGENT.GET_MY_LEADS)
  async getLeads(@Req() req: AgentRequest): Promise<Lead[]> {
    const user = req.user;
    return this.agentService.getLeadsByPublicId(user.sub);
  }

  @UsePermissions(ENDPOINTS_PERMISSIONS.CURRENT_AGENT.UPDATE_ME)
  @UseGuards(AgentAccessGuard, PermissionsGuard)
  @Patch(ENDPOINTS.AGENT.UPDATE_ME)
  async updateMe(@Req() req: AgentRequest, @Body() body: UpdateAgent): Promise<Agent> {
    const user = req.user;
    return this.agentService.updateByPublicId(user.sub, body);
  }

  @UseGuards(AgentAccessGuard)
  @Get(ENDPOINTS.AGENT.GET_ME)
  async getMe(@Req() req: AgentRequest): Promise<FullAgent> {
    const user = req.user;
    return this.agentService.getOneFullByPublicId(user.sub);
  }
}
