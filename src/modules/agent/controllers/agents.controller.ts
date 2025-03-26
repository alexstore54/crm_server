import { Body, Controller, Get, Param, Patch, Post, UploadedFile, UseGuards } from '@nestjs/common';
import { AgentAccessGuard } from '@/common/guards/tokens/agent';
import { AgentService } from '../services/agent.service';
import { CreateAgent, UpdateAgent } from '../dto';
import { AgentPermissionGuard, PermissionsGuard } from '@/common/guards/permissions';
import { UsePermissions } from '@/common/decorators/validation';
import { ENDPOINTS_PERMISSIONS } from '@/shared/constants/permissions';
import { UUIDValidationPipe } from '@/common/pipes';
import { ENDPOINTS, RESPONSE_STATUS } from '@/shared/constants/endpoints';
import { UploadPicture } from '@/common/decorators/media';

@Controller(ENDPOINTS.AGENTS.BASE)
export class AgentsController {
  constructor(private readonly agentService: AgentService) {}

  @UsePermissions(ENDPOINTS_PERMISSIONS.AGENTS.GET_AGENT_LEADS)
  @UseGuards(AgentAccessGuard, PermissionsGuard, AgentPermissionGuard)
  @Get(ENDPOINTS.AGENTS.GET_AGENT_LEADS)
  async getLeadsByAgentId(@Param('publicId', UUIDValidationPipe) publicId: string) {
    return this.agentService.getLeadsByPublicId(publicId);
  }

  @UploadPicture()
  @UsePermissions(ENDPOINTS_PERMISSIONS.AGENTS.CREATE_AGENT)
  @UseGuards(AgentAccessGuard, PermissionsGuard)
  @Post(ENDPOINTS.AGENTS.CREATE_AGENT)
  async createAgent(
    @Body() body: CreateAgent,
    @UploadedFile() file?: Express.Multer.File,
  ): Promise<string> {
    await this.agentService.createAgent(body, file);
    return RESPONSE_STATUS.SUCCESS;
  }

  @UploadPicture()
  @UsePermissions(ENDPOINTS_PERMISSIONS.AGENTS.UPDATE_AGENT)
  @UseGuards(AgentAccessGuard, PermissionsGuard)
  @Patch(ENDPOINTS.AGENTS.UPDATE_AGENT)
  async updateAgent(
    @Param('publicId') publicId: string,
    @Body() body: UpdateAgent,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    return this.agentService.updateByPublicId(publicId, body, file);
  }
}
