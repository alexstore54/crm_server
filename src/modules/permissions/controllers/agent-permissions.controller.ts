import { Body, Controller, Get, Param, Put, UseGuards } from '@nestjs/common';
import { AgentAccessGuard } from '@/common/guards/tokens/agent';
import { UpdateAgentPermissions } from '@/modules/agent/dto/update-agent-perms.dto';
import { AgentPermissionsService } from '@/modules/permissions/service';
import { AgentPermissionGuard, PermissionsGuard } from '@/common/guards/permissions';
import { ENDPOINTS_PERMISSIONS } from '@/shared/constants/permissions';
import { UsePermissions } from '@/common/decorators/validation';
import { UUIDValidationPipe } from '@/common/pipes';
import { ENDPOINTS } from '@/shared/constants/endpoints';

@Controller(ENDPOINTS.AGENT_PERMISSIONS.BASE)
export class AgentPermissionsController {
  constructor(private readonly agentPermissionsService: AgentPermissionsService) {}

  @UsePermissions(ENDPOINTS_PERMISSIONS.AGENT_PERMISSIONS.UPDATE_AGENTS_PERMISSIONS)
  @UseGuards(AgentAccessGuard, PermissionsGuard, AgentPermissionGuard)
  @Put(ENDPOINTS.AGENT_PERMISSIONS.UPDATE_AGENT_PERMISSIONS)
  async updateAgentPermissions(
    @Param('publicId', UUIDValidationPipe) publicId: string,
    @Body() body: UpdateAgentPermissions,
  ) {
    return this.agentPermissionsService.updateManyByAgentId(publicId, body);
  }

  @UsePermissions(ENDPOINTS_PERMISSIONS.AGENT_PERMISSIONS.GET_AGENTS_PERMISSIONS)
  @UseGuards(AgentAccessGuard, PermissionsGuard, AgentPermissionGuard)
  @Get(ENDPOINTS.AGENT_PERMISSIONS.GET_AGENT_PERMISSIONS)
  async getAgentPermissions(@Param('publicId', UUIDValidationPipe) publicId: string) {
    return this.agentPermissionsService.getPermissionsByAgentPublicId(publicId);
  }
}
