import { Body, Controller, Get, Param, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { AgentAccessGuard } from '@/common/guards/tokens/agent';
import { RequestWithAgentPayload } from '@/shared/types/auth';
import { AgentService } from '../services/agent.service';
import { CreateAgent, UpdateAgent } from '../dto';

@Controller('agents')
export class AgentController {
  constructor(private readonly agentService: AgentService) {}

  @UseGuards(AgentAccessGuard)
  @Get('leads')
  async getLeadsByAgentId(@Req() request: RequestWithAgentPayload) {
    const payload = request.user;

    return this.agentService.getLeadsByPublicId(payload.sub);
  }

  @UseGuards(AgentAccessGuard)
  @Post('create')
  async createAgent(@Body() body: CreateAgent, @Req() request: RequestWithAgentPayload) {
    return this.agentService.createAgent(body);
  }

  @UseGuards(AgentAccessGuard)
  @Patch('update/:publicId')
  async updateAgent(@Param('publicId') publicId: string, @Body() body: UpdateAgent) {
    return this.agentService.updateAgentByPublicId(publicId, body);
  }

}
