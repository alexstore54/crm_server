import { Body, Controller, Get, Param, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { AgentAccessGuard } from '@/common/guards/tokens/agent';
import { PermissionsKeys, RequestWithAgentPayload } from '@/shared/types/auth';
import { AgentService } from '../services/agent.service';
import { CreateAgent, GetAgentLeadsParams, UpdateAgent } from '../dto';
import { PermissionsGuard } from '@/common/guards/permissions';
import { SomePermissionRequired } from '@/common/decorators/validation';

@Controller('agents')
export class AgentsController {
  constructor(private readonly agentService: AgentService) {}

  @SomePermissionRequired([PermissionsKeys.READ_TEAMS, PermissionsKeys.READ_DESKS])
  @UseGuards(AgentAccessGuard, PermissionsGuard)
  @Get(':publicId/leads')
  async getLeadsByAgentId(
    @Param() params: GetAgentLeadsParams,
    @Req() request: RequestWithAgentPayload,
  ) {
    const { publicId } = params;

    return this.agentService.getLeadsByPublicId(publicId);
  }

  @SomePermissionRequired([PermissionsKeys.CREATE_AGENTS])
  @UseGuards(AgentAccessGuard, PermissionsGuard)
  @Post('create')
  async createAgent(@Body() body: CreateAgent) {
    return this.agentService.createAgent(body);
  }

  @SomePermissionRequired([PermissionsKeys.UPDATE_ALL_AGENTS])
  @UseGuards(AgentAccessGuard, PermissionsGuard)
  @Patch(':publicId/update')
  async updateAgent(@Param('publicId') publicId: string, @Body() body: UpdateAgent) {
    return this.agentService.updateByPublicId(publicId, body);
  }
}
