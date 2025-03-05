import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Req,
  SetMetadata,
  UseGuards,
} from '@nestjs/common';
import { AgentAccessGuard } from '@/common/guards/tokens/agent';
import { PermissionsKeys, RequestWithAgentPayload } from '@/shared/types/auth';
import { AgentService } from '../services/agent.service';
import { CreateAgent, GetAgentLeadsParams, UpdateAgent } from '../dto';
import { AgentPermissionGuard, PermissionsGuard } from '@/common/guards/permissions';
import { UsePermissions } from '@/common/decorators/validation';
import { METADATA } from '@/shared/constants/metadata';

@Controller('agents')
export class AgentsController {
  constructor(private readonly agentService: AgentService) {}

  @UsePermissions([
    PermissionsKeys.READ_DESK_LEADS,
    PermissionsKeys.READ_TEAM_LEADS,
    PermissionsKeys.READ_ALL_LEADS,
  ])
  @UseGuards(AgentAccessGuard, PermissionsGuard, AgentPermissionGuard)
  @Get(':publicId/leads')
  async getLeadsByAgentId(
    @Param() params: GetAgentLeadsParams,
    @Req() request: RequestWithAgentPayload,
  ) {
    const { publicId } = params;
    SetMetadata(METADATA.AGENT_PERMISSIONS, request.permissions);
    return this.agentService.getLeadsByPublicId(publicId);
  }

  @UsePermissions([PermissionsKeys.CREATE_AGENTS])
  @UseGuards(AgentAccessGuard, PermissionsGuard)
  @Post('create')
  async createAgent(@Body() body: CreateAgent) {
    return this.agentService.createAgent(body);
  }

  @UsePermissions([PermissionsKeys.UPDATE_ALL_AGENTS])
  @UseGuards(AgentAccessGuard, PermissionsGuard)
  @Patch(':publicId/update')
  async updateAgent(@Param('publicId') publicId: string, @Body() body: UpdateAgent) {
    return this.agentService.updateByPublicId(publicId, body);
  }
}
