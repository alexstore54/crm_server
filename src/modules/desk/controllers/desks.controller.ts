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
  UploadedFile,
  UseGuards,
} from '@nestjs/common';
import { ENDPOINTS, RESPONSE_STATUS } from '@/shared/constants/endpoints';
import { DeskService } from '@/modules/desk/services/desk.service';
import { UsePermissions } from '@/common/decorators/validation';
import { ENDPOINTS_PERMISSIONS } from '@/shared/constants/permissions';
import { Desk, Team } from '@prisma/client';
import { AgentAccessGuard } from '@/common/guards/tokens/agent';
import { PermissionsGuard } from '@/common/guards/permissions';
import { UUIDValidationPipe } from '@/common/pipes';
import { CreateDesk, UpdateDesk } from '@/modules/desk/dto/desks';
import { UploadPicture } from '@/common/decorators/media';

@Controller(ENDPOINTS.DESKS.BASE)
export class DesksController {
  constructor(private readonly deskService: DeskService) {}

  @UsePermissions(ENDPOINTS_PERMISSIONS.DESKS.GET_DESK)
  @UseGuards(AgentAccessGuard, PermissionsGuard)
  @Get(ENDPOINTS.DESKS.GET_DESK)
  public async getDesk(@Param('publicId', UUIDValidationPipe) publicId: string): Promise<Desk> {
    return this.deskService.getOne(publicId);
  }

  @UsePermissions(ENDPOINTS_PERMISSIONS.DESKS.GET_ALL_DESKS)
  @UseGuards(AgentAccessGuard, PermissionsGuard)
  @Get(ENDPOINTS.DESKS.GET_ALL_DESKS)
  public async getManyDesks(
    @Query('page', ParseIntPipe) page: number,
    @Query('limit', ParseIntPipe) limit: number,
  ): Promise<Desk[]> {
    return this.deskService.getMany(page, limit);
  }

  @UsePermissions(ENDPOINTS_PERMISSIONS.DESKS.GET_DESK_TEAMS)
  @UseGuards(AgentAccessGuard, PermissionsGuard)
  @Get(ENDPOINTS.DESKS.GET_DESK_TEAMS)
  public async getDeskTeams(
    @Param('publicId', UUIDValidationPipe) publicId: string,
  ): Promise<Team[]> {
    return this.deskService.getTeamsByPublicId(publicId);
  }

  @UploadPicture()
  @UsePermissions(ENDPOINTS_PERMISSIONS.DESKS.UPDATE_DESK)
  @UseGuards(AgentAccessGuard, PermissionsGuard)
  @Patch(ENDPOINTS.DESKS.UPDATE_DESK)
  public async updateDesk(
    @Param('publicId', UUIDValidationPipe) publicId: string,
    @Body() body: UpdateDesk,
    @UploadedFile() file?: Express.Multer.File,
  ): Promise<Desk> {
    return this.deskService.updateDesk(publicId, body, file);
  }

  @UploadPicture()
  @UsePermissions(ENDPOINTS_PERMISSIONS.DESKS.CREATE_DESK)
  @UseGuards(AgentAccessGuard, PermissionsGuard)
  @Post(ENDPOINTS.DESKS.CREATE_DESK)
  public async createDesk(
    @Body() body: CreateDesk,
    @UploadedFile() file?: Express.Multer.File,
  ): Promise<Desk> {
    return this.deskService.createOne(body, file);
  }

  @UsePermissions(ENDPOINTS_PERMISSIONS.DESKS.DELETE_DESK)
  @UseGuards(AgentAccessGuard, PermissionsGuard)
  @Delete(ENDPOINTS.DESKS.DELETE_DESK)
  public async deleteDesk(
    @Param('publicId', UUIDValidationPipe) publicId: string,
  ): Promise<string> {
    await this.deskService.removeOne(publicId);
    return RESPONSE_STATUS.SUCCESS;
  }
}