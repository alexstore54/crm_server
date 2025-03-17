import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { UsePermissions } from '@/common/decorators/validation';
import { ENDPOINTS_PERMISSIONS } from '@/shared/constants/permissions';
import { AgentAccessGuard } from '@/common/guards/tokens/agent';
import { PermissionsGuard } from '@/common/guards/permissions';
import { CreateTeam, UpdateTeam } from '@/modules/team/dto';
import { UUIDValidationPipe } from '@/common/pipes';
import { ENDPOINTS } from '@/shared/constants/endpoints';

@Controller(ENDPOINTS.TEAMS.BASE)
export class TeamsController {
  @UsePermissions(ENDPOINTS_PERMISSIONS.TEAMS.CREATE_TEAM)
  @UseGuards(AgentAccessGuard, PermissionsGuard)
  @Post(ENDPOINTS.TEAMS.CREATE_TEAM)
  async createTeam(@Body() body: CreateTeam) {
    return;
  }

  @UsePermissions(ENDPOINTS_PERMISSIONS.TEAMS.UPDATE_TEAM)
  @UseGuards(AgentAccessGuard, PermissionsGuard)
  @Patch(ENDPOINTS.TEAMS.UPDATE_TEAM)
  async updateTeam(
    @Body() body: UpdateTeam,
    @Param('publicId', UUIDValidationPipe) publicId: string,
  ) {
    return;
  }

  @Get(ENDPOINTS.TEAMS.GET_TEAM)
  async getTeam(@Param('publicId', UUIDValidationPipe) publicId: string) {
    return;
  }

  @UsePermissions(ENDPOINTS_PERMISSIONS.TEAMS.DELETE_TEAM)
  @UseGuards(AgentAccessGuard, PermissionsGuard)
  @Delete(ENDPOINTS.TEAMS.DELETE_TEAM)
  async deleteTeam(@Param('publicId', UUIDValidationPipe) publicId: string) {
    return;
  }
}
