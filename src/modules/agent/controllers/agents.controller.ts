import { Body, Controller, Get, Param, Patch, Post, Put, UseGuards } from '@nestjs/common';
import { AgentAccessGuard } from '@/common/guards/tokens/agent';
import { AgentService } from '../services/agent.service';
import { CreateAgent, GetAgentLeadsParams, UpdateAgent } from '../dto';
import { AgentPermissionGuard, PermissionsGuard } from '@/common/guards/permissions';
import { UsePermissions } from '@/common/decorators/validation';
import { ENDPOINTS_PERMISSIONS } from '@/shared/constants/permissions';

@Controller('agents')
export class AgentsController {
  constructor(private readonly agentService: AgentService) {}

  @UsePermissions(ENDPOINTS_PERMISSIONS.AGENTS.GET_AGENT_LEADS)
  @UseGuards(AgentAccessGuard, PermissionsGuard, AgentPermissionGuard)
  @Get(':publicId/leads')
  async getLeadsByAgentId(@Param() params: GetAgentLeadsParams) {
    const { publicId } = params;
    return this.agentService.getLeadsByPublicId(publicId);
  }

  @UsePermissions(ENDPOINTS_PERMISSIONS.AGENTS.CREATE_AGENT)
  @UseGuards(AgentAccessGuard, PermissionsGuard)
  @Post('create')
  async createAgent(@Body() body: CreateAgent) {
    return this.agentService.createAgent(body);
  }

  @UsePermissions(ENDPOINTS_PERMISSIONS.AGENTS.GET_AGENT_LEADS)
  @UseGuards(AgentAccessGuard, PermissionsGuard)
  @Put(':publicId/update')
  async updateAgent(@Param('publicId') publicId: string, @Body() body: UpdateAgent) {
    return this.agentService.updateByPublicId(publicId, body);
  }
}
