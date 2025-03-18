import { Body, Controller, Param, Post, UseGuards } from '@nestjs/common';
import { ENDPOINTS } from '@/shared/constants/endpoints';
import { AssignShift } from '@/modules/desk/dto/shifts/assign-shift.dto';
import { UnassignShift } from '@/modules/desk/dto/shifts/unassign-shift.dto';
import { AgentAccessGuard } from '@/common/guards/tokens/agent';
import { PermissionsGuard } from '@/common/guards/permissions';
import { UsePermissions } from '@/common/decorators/validation';
import { ENDPOINTS_PERMISSIONS } from '@/shared/constants/permissions';
import { ShiftService } from '@/modules/desk/services/shift.service';
import { AgentForClient } from '@/shared/types/agent';
import { UUIDValidationPipe } from '@/common/pipes';

@Controller(ENDPOINTS.DESKS_ADMINS.BASE)
export class DesksAdminsController {
  constructor(private readonly shiftService: ShiftService) {}

  @UsePermissions(ENDPOINTS_PERMISSIONS.DESK_ADMINS.ASSIGN_SHIFT)
  @UseGuards(AgentAccessGuard, PermissionsGuard)
  @Post(ENDPOINTS.DESKS_ADMINS.ASSIGN_SHIFT)
  public async assignShift(
    @Body() body: AssignShift,
    @Param('publicId', UUIDValidationPipe) publicId: string,
  ): Promise<AgentForClient[]> {
    return this.shiftService.assign(publicId, body);
  }

  @UsePermissions(ENDPOINTS_PERMISSIONS.DESK_ADMINS.ASSIGN_SHIFT)
  @UseGuards(AgentAccessGuard, PermissionsGuard)
  @Post(ENDPOINTS.DESKS_ADMINS.UNASSIGN_SHIFT)
  public async unassignShift(
    @Body() body: UnassignShift,
    @Param('publicId', UUIDValidationPipe) publicId: string,
  ): Promise<AgentForClient[]> {
    return this.shiftService.unassign(publicId, body);
  }

  @UsePermissions(ENDPOINTS_PERMISSIONS.DESK_ADMINS.GET_ALL)
  @UseGuards(AgentAccessGuard, PermissionsGuard)
  @Post(ENDPOINTS.DESKS_ADMINS.GET_ADMINS)
  public async getAll(
    @Param('publicId', UUIDValidationPipe) publicId: string,
  ): Promise<AgentForClient[]> {
    return this.shiftService.getAll(publicId);
  }
}