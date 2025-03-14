import { Controller, Get, Param, ParseIntPipe, Query, UseGuards } from '@nestjs/common';
import { Log } from '@prisma/client';
import { LogsService } from '@/modules/logger/services';
import { ENDPOINTS } from '@/shared/constants/endpoints';
import { UUIDValidationPipe } from '@/common/pipes';
import { AgentAccessGuard } from '@/common/guards/tokens/agent';
import { PermissionsGuard } from '@/common/guards/permissions';
import { ENDPOINTS_PERMISSIONS } from '@/shared/constants/permissions';
import { UsePermissions } from '@/common/decorators/validation';

@Controller(ENDPOINTS.LOGS.BASE)
export class LogsController {
  constructor(private loggerService: LogsService) {}

  @UsePermissions(ENDPOINTS_PERMISSIONS.LOGS.READ_LOGS)
  @UseGuards(AgentAccessGuard, PermissionsGuard)
  @Get(ENDPOINTS.LOGS.GET_LOGS)
  async getLogs(
    @Query('page', ParseIntPipe) page: number,
    @Query('limit', ParseIntPipe) limit: number,
  ): Promise<Log[]> {
    return this.loggerService.getLogs(page, limit);
  }

  @UsePermissions(ENDPOINTS_PERMISSIONS.LOGS.READ_LOGS)
  @UseGuards(AgentAccessGuard, PermissionsGuard)
  @Get(ENDPOINTS.LOGS.GET_USERS_LOGS)
  async getLogsByUserId(@Param(':publicId', UUIDValidationPipe) publicId: string): Promise<Log[]> {
    return this.loggerService.getLogsByUserPublicId(publicId);
  }

  @UsePermissions(ENDPOINTS_PERMISSIONS.LOGS.READ_LOGS)
  @UseGuards(AgentAccessGuard, PermissionsGuard)
  @Get(ENDPOINTS.LOGS.GET_ONE_LOG)
  async getLogById(@Param('id', ParseIntPipe) id: number): Promise<Log | null> {
    return this.loggerService.getLogById(id);
  }
}
