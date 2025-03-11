import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { UsePermissions } from '@/common/decorators/validation';
import { ENDPOINTS_PERMISSIONS } from '@/shared/constants/permissions';
import { AgentAccessGuard } from '@/common/guards/tokens/agent';
import { PermissionsGuard } from '@/common/guards/permissions';
import { CreateTeam, UpdateTeam } from '@/modules/team/dto';
import { UUIDValidationPipe } from '@/common/pipes';

@Controller('teams')
export class TeamsController {
  @UsePermissions(ENDPOINTS_PERMISSIONS.TEAMS.CREATE_TEAM)
  @UseGuards(AgentAccessGuard, PermissionsGuard)
  @Post('create')
  async createTeam(@Body() body: CreateTeam) {
    return;
  }

  @UsePermissions(ENDPOINTS_PERMISSIONS.TEAMS.UPDATE_TEAM)
  @UseGuards(AgentAccessGuard, PermissionsGuard)
  @Patch(':publicId/update')
  async updateTeam(
    @Body() body: UpdateTeam,
    @Param('publicId', UUIDValidationPipe) publicId: string,
  ) {
    return;
  }

  @Get(':publicId')
  async getTeam(@Param('publicId', UUIDValidationPipe) publicId: string) {
    return;
  }

  @UsePermissions(ENDPOINTS_PERMISSIONS.TEAMS.DELETE_TEAM)
  @UseGuards(AgentAccessGuard, PermissionsGuard)
  @Delete(':publicId/delete')
  async deleteTeam(@Param('publicId', UUIDValidationPipe) publicId: string) {
    return;
  }
}
