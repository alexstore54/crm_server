import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { UsePermissions } from '@/common/decorators/validation';
import { ENDPOINTS_PERMISSIONS } from '@/shared/constants/permissions';
import { AgentAccessGuard } from '@/common/guards/tokens/agent';
import { PermissionsGuard } from '@/common/guards/permissions';
import { CreateTeam, UpdateTeam } from '@/modules/team/dto';
import { UUIDValidationPipe } from '@/common/pipes';
import { ENDPOINTS, RESPONSE_STATUS } from '@/shared/constants/endpoints';
import { TeamService } from '@/modules/team/services/team.service';
import { Team } from '@prisma/client';
import { TeamPermissionsGuard } from '@/common/guards/permissions/team-operation-permissions.guard';

@Controller(ENDPOINTS.TEAMS.BASE)
export class TeamsController {
  constructor(private readonly teamService: TeamService) {}

  @UsePermissions(ENDPOINTS_PERMISSIONS.TEAMS.CREATE_TEAM)
  @UseGuards(AgentAccessGuard, PermissionsGuard)
  @Post(ENDPOINTS.TEAMS.CREATE_TEAM)
  async createTeam(@Body() body: CreateTeam): Promise<Team> {
    return this.teamService.createOne(body);
  }

  @UsePermissions(ENDPOINTS_PERMISSIONS.TEAMS.UPDATE_TEAM)
  @UseGuards(AgentAccessGuard, PermissionsGuard)
  @Patch(ENDPOINTS.TEAMS.UPDATE_TEAM)
  async updateTeam(
    @Body() body: UpdateTeam,
    @Param('publicId', UUIDValidationPipe) publicId: string,
  ): Promise<Team> {
    return this.teamService.updateOne(publicId, body);
  }

  @UsePermissions(ENDPOINTS_PERMISSIONS.TEAMS.GET_ALL_TEAMS)
  @UseGuards(AgentAccessGuard, PermissionsGuard)
  @Get(ENDPOINTS.TEAMS.GET_ALL_TEAMS)
  async getAllTeams(
    @Query('page', ParseIntPipe) page: number,
    @Query('limit', ParseIntPipe) limit: number,
  ) {
    return this.teamService.getManyTeams(page, limit);
  }

  @UsePermissions(ENDPOINTS_PERMISSIONS.TEAMS.GET_TEAM)
  @UseGuards(AgentAccessGuard, PermissionsGuard, TeamPermissionsGuard)
  @Get(ENDPOINTS.TEAMS.GET_TEAM)
  async getTeam(@Param('publicId', UUIDValidationPipe) publicId: string) {
    return this.teamService.getTeamByPublicId(publicId);
  }

  @UsePermissions(ENDPOINTS_PERMISSIONS.TEAMS.DELETE_TEAM)
  @UseGuards(AgentAccessGuard, PermissionsGuard, TeamPermissionsGuard)
  @Delete(ENDPOINTS.TEAMS.DELETE_TEAM)
  async deleteTeam(@Param('publicId', UUIDValidationPipe) publicId: string) {
    await this.teamService.deleteOne(publicId);
    return RESPONSE_STATUS.SUCCESS;
  }
}
