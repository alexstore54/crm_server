import {
  Body,
  Controller,
  ForbiddenException,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AgentAccessGuard } from '@/common/guards/tokens/agent';
import { PermissionsKeys, RequestWithAgentPayload } from '@/shared/types/auth';
import { AgentService } from '../services/agent.service';
import { CreateAgent, GetAgentLeadsParams, UpdateAgent } from '../dto';
import { PermissionsGuard } from '@/common/guards/permissions';
import { SomePermissionRequired } from '@/common/decorators/validation';
import { ValidationService } from '@/shared/services/validation';
import { ERROR_MESSAGES } from '@/shared/constants/errors';

@Controller('agents')
export class AgentsController {
  constructor(
    private readonly agentService: AgentService,
    private readonly validationService: ValidationService,
  ) {}

  @SomePermissionRequired([PermissionsKeys.READ_TEAMS, PermissionsKeys.READ_DESKS])
  @UseGuards(AgentAccessGuard, PermissionsGuard)
  @Get(':publicId/leads')
  async getLeadsByAgentId(
    @Param() params: GetAgentLeadsParams,
    @Req() request: RequestWithAgentPayload,
  ) {
    const { publicId } = params;
    const payload = request.user;
    const { teamPublicId, deskPublicId } = payload;
    const publicIds = [publicId, payload.sub];

    const isAgentsInOneDesk = await this.validationService.isAgentsInOneDesk(
      publicIds,
      deskPublicId,
    );

    if (isAgentsInOneDesk) {
      return this.agentService.getLeadsByPublicId(publicId);
    }

    const isAgentInOneTeam = await this.validationService.isAgentsInOneTeam(
      publicIds,
      teamPublicId,
    );

    if (isAgentInOneTeam) {
      return this.agentService.getLeadsByPublicId(publicId);
    }

    throw new ForbiddenException(ERROR_MESSAGES.DONT_HAVE_RIGHTS);
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
