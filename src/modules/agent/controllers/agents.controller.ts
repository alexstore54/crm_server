import { Body, Controller, Get, Param, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { AgentAccessGuard } from '@/common/guards/tokens/agent';
import { PermissionsKeys } from '@/shared/types/auth';
import { AgentService } from '../services/agent.service';
import { CreateAgent, UpdateAgent, GetAgentLeadsParams } from '../dto';
import { PermissionsGuard } from '@/common/guards/permissions';
import { PermissionsRequired } from '@/common/decorators/validation';

@Controller('agents')
export class AgentsController {
  constructor(private readonly agentService: AgentService) {}

  @PermissionsRequired([PermissionsKeys.READ_TEAMS, PermissionsKeys.READ_DESKS])
  @UseGuards(AgentAccessGuard, PermissionsGuard)
  @Get(':publicId/leads')
  async getLeadsByAgentId(@Param() params: GetAgentLeadsParams) {
    const { publicId } = params;

    return this.agentService.getLeadsByPublicId(publicId);
  }

  @UseGuards(AgentAccessGuard)
  @Post('create')
  async createAgent(@Body() body: CreateAgent) {
    return this.agentService.createAgent(body);
  }

  @UseGuards(AgentAccessGuard)
  @Patch('update/:publicId')
  async updateAgent(@Param('publicId') publicId: string, @Body() body: UpdateAgent) {
    return this.agentService.updateAgentByPublicId(publicId, body);
  }
}
