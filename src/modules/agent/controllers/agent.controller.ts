import { Controller, Get, Req } from '@nestjs/common';
import { AgentService } from '@/modules/agent/services/agent.service';
import { RequestWithAgentPayload } from '@/shared/types/auth';
import { Lead } from '@prisma/client';

@Controller('agent')
export class AgentController {
  constructor(private readonly agentService: AgentService) {}

  @Get('my-leads')
  async getLeads(@Req() req: RequestWithAgentPayload): Promise<Lead[]> {
    const user = req.user;
    return this.agentService.getLeadsByPublicId(user.sub);
  }
}
