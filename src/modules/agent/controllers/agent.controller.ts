import { Body, Controller, Get, Req, UseGuards } from '@nestjs/common';
import { AgentService } from '@/modules/agent/services/agent.service';
import { PermissionsKeys, RequestWithAgentPayload } from '@/shared/types/auth';
import { Agent, Lead } from '@prisma/client';
import { UpdateAgent } from '@/modules/agent/dto';
import { AgentAccessGuard } from '@/common/guards/tokens/agent';
import { PermissionsGuard } from '@/common/guards/permissions';
import { SomePermissionRequired } from '@/common/decorators/validation';

@Controller('agent')
export class AgentController {
  constructor(private readonly agentService: AgentService) {}

  @UseGuards(AgentAccessGuard)
  @Get('my-leads')
  async getLeads(@Req() req: RequestWithAgentPayload): Promise<Lead[]> {
    const user = req.user;
    return this.agentService.getLeadsByPublicId(user.sub);
  }

  @SomePermissionRequired([PermissionsKeys.UPDATE_HIMSELF])
  @UseGuards(AgentAccessGuard, PermissionsGuard)
  @Get('update')
  async updateMe(@Req() req: RequestWithAgentPayload, @Body() body: UpdateAgent): Promise<Agent> {
    const user = req.user;
    return this.agentService.updateByPublicId(user.sub, body);
  }
}
