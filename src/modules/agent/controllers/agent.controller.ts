import { Body, Controller, Get, Patch, Req, UseGuards } from '@nestjs/common';
import { AgentService } from '@/modules/agent/services/agent.service';
import { RequestWithAgentPayload } from '@/shared/types/auth';
import { Agent, Lead } from '@prisma/client';
import { UpdateAgent } from '@/modules/agent/dto';
import { AgentAccessGuard } from '@/common/guards/tokens/agent';
import { PermissionsGuard } from '@/common/guards/permissions';
import { UsePermissions } from '@/common/decorators/validation';
import { ENDPOINTS_PERMISSIONS } from '@/shared/constants/permissions';

@Controller('agent')
export class AgentController {
  constructor(private readonly agentService: AgentService) {}

  @UseGuards(AgentAccessGuard)
  @Get('my-leads')
  async getLeads(@Req() req: RequestWithAgentPayload): Promise<Lead[]> {
    const user = req.user;
    return this.agentService.getLeadsByPublicId(user.sub);
  }

  @UsePermissions(ENDPOINTS_PERMISSIONS.AGENT.UPDATE_ME)
  @UseGuards(AgentAccessGuard, PermissionsGuard)
  @Patch('update-me')
  async updateMe(@Req() req: RequestWithAgentPayload, @Body() body: UpdateAgent): Promise<Agent> {
    const user = req.user;
    return this.agentService.updateByPublicId(user.sub, body);
  }

  @UseGuards(AgentAccessGuard)
  @Get('me')
  async getMe(@Req() req: RequestWithAgentPayload) {
    const user = req.user;
    return this.agentService.getOneFullByPublicId(user.sub);
  }
}
