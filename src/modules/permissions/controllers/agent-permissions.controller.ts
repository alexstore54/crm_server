import { Body, Controller, Param, Patch, UseGuards } from '@nestjs/common';
import { AgentAccessGuard, ModeratorGuard } from '@/common/guards/tokens/agent';
import { UpdateAgentPerms } from '@/modules/agent/dto/update-agent-perms.dto';
import { AgentPermissionsService } from '@/modules/permissions/service';

@Controller('permissions/agent')
export class AgentPermissionsController {
  constructor(private readonly agentPermissionsService: AgentPermissionsService) {}

  @UseGuards(AgentAccessGuard, ModeratorGuard)
  @Patch(':publicId/permissions/update')
  async updateAgentPermissions(
    @Param('publicId') publicId: string,
    @Body() body: UpdateAgentPerms,
  ) {
    return this.agentPermissionsService.updateOneByAgentPublicId(publicId, body);
  }
}
