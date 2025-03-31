import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { ENDPOINTS } from '@/shared/constants/endpoints';
import { AgentAccessGuard } from '@/common/guards/tokens/agent';
import { PermissionsGuard } from '@/common/guards/permissions';
import { UsePermissions } from '@/common/decorators/validation';
import { UUIDValidationPipe } from '@/common/pipes';
import { ENDPOINTS_PERMISSIONS } from '@/shared/constants/permissions';
import { MediaImagesService } from '@/modules/media';
import { MediaDir } from '@/shared/types/media';

@Controller(ENDPOINTS.MEDIA.BASE)
export class MediaController {
  constructor(private readonly imagesService: MediaImagesService) {}

  @UsePermissions(ENDPOINTS_PERMISSIONS.MEDIA.GET_AGENT_IMAGE)
  @UseGuards(AgentAccessGuard, PermissionsGuard)
  @Get(ENDPOINTS.MEDIA.GET_AGENT_IMAGE)
  async getAgentImage(
    @Param('publicId', UUIDValidationPipe) publicId: string,
    @Query('name') name: string,
  ): Promise<string> {
    return this.imagesService.getImageForEndpointBASE64(name, publicId, MediaDir.AGENTS);
  }

  @UsePermissions(ENDPOINTS_PERMISSIONS.MEDIA.GET_DESK_IMAGE)
  @UseGuards(AgentAccessGuard, PermissionsGuard)
  @Get(ENDPOINTS.MEDIA.GET_DESK_IMAGE)
  async getDeskImage(
    @Param('publicId', UUIDValidationPipe) publicId: string,
    @Query('name') name: string,
  ): Promise<string> {
    return this.imagesService.getImageForEndpointBASE64(name, publicId, MediaDir.DESKS);
  }

  @UsePermissions(ENDPOINTS_PERMISSIONS.MEDIA.GET_ROLE_IMAGE)
  @UseGuards(AgentAccessGuard, PermissionsGuard)
  @Get(ENDPOINTS.MEDIA.GET_ROLE_IMAGE)
  async getRoleImage(
    @Param('publicId', UUIDValidationPipe) publicId: string,
    @Query('name') name: string,
  ): Promise<string> {
    return this.imagesService.getImageForEndpointBASE64(name, publicId, MediaDir.ROLES);
  }

  @UsePermissions(ENDPOINTS_PERMISSIONS.MEDIA.GET_TEAM_IMAGE)
  @UseGuards(AgentAccessGuard, PermissionsGuard)
  @Get(ENDPOINTS.MEDIA.GET_TEAM_IMAGE)
  async getTeamImage(
    @Param('publicId', UUIDValidationPipe) publicId: string,
    @Query('name') name: string,
  ): Promise<string> {
    return this.imagesService.getImageForEndpointBASE64(name, publicId, MediaDir.TEAMS);
  }
}