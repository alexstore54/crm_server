import { Body, Controller, Param, Patch, UseGuards } from '@nestjs/common';
import { AgentAccessGuard } from '@/common/guards/tokens/agent';
import { UpdateAgentPermissions } from '@/modules/agent/dto/update-agent-perms.dto';
import { AgentPermissionsService } from '@/modules/permissions/service';
import { AgentPermissionGuard, PermissionsGuard } from '@/common/guards/permissions';
import { ENDPOINTS_PERMISSIONS } from '@/shared/constants/permissions';
import { UsePermissions } from '@/common/decorators/validation';

@Controller('permissions/agent')
export class AgentPermissionsController {
  constructor(private readonly agentPermissionsService: AgentPermissionsService) {}

  @UsePermissions(ENDPOINTS_PERMISSIONS.AGENT_PERMISSIONS.UPDATE_AGENTS_PERMISSIONS)
  @UseGuards(AgentAccessGuard, PermissionsGuard, AgentPermissionGuard)
  @Patch(':publicId/update')
  async updateAgentPermissions(
    @Param('publicId') publicId: string,
    @Body() body: UpdateAgentPermissions,
  ) {
    // return this.agentPermissionsService.updateOneByAgentPublicId(publicId, body);
  }
}
