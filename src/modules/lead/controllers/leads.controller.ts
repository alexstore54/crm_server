import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ENDPOINTS_PERMISSIONS } from '@/shared/constants/permissions';
import { ENDPOINTS } from '@/shared/constants/endpoints';
import { LeadsService } from '@/modules/lead/services';
import { AgentAccessGuard } from '@/common/guards/tokens/agent';
import { LeadPermissionGuard, PermissionsGuard } from '@/common/guards/permissions';
import { UsePermissions } from '@/common/decorators/validation';
import { UUIDValidationPipe } from '@/common/pipes';
import { UpdateLead } from '@/modules/lead/dto/lead';
import { FullLead } from '@/shared/types/user';

@Controller(ENDPOINTS.LEADS.BASE)
export class LeadsController {
  constructor(private readonly leadsService: LeadsService) {}

  @UsePermissions(ENDPOINTS_PERMISSIONS.LEADS.GET_LEAD)
  @UseGuards(AgentAccessGuard, PermissionsGuard, LeadPermissionGuard)
  @Get(ENDPOINTS.LEADS.GET_LEAD)
  async getLeads(@Param('publicId', UUIDValidationPipe) publicId: string): Promise<FullLead> {
    return this.leadsService.getOneByPublicId(publicId);
  }

  @UsePermissions(ENDPOINTS_PERMISSIONS.LEADS.GET_ALL_LEADS)
  @UseGuards(AgentAccessGuard, PermissionsGuard)
  @Get(ENDPOINTS.LEADS.GET_ALL_LEADS)
  async getAllLeads(
    @Query('page', ParseIntPipe) page: number,
    @Query('limit', ParseIntPipe) limit: number,
  ) {
    return;
  }

  @UsePermissions(ENDPOINTS_PERMISSIONS.LEADS.UPDATE_LEAD)
  @UseGuards(AgentAccessGuard, PermissionsGuard, LeadPermissionGuard)
  @Patch(ENDPOINTS.LEADS.UPDATE_LEAD)
  async updateLead(
    @Param('publicId', UUIDValidationPipe) publicId: string,
    @Body() body: UpdateLead,
  ) {
    return;
  }

  @UsePermissions(ENDPOINTS_PERMISSIONS.LEADS.DELETE_LEAD)
  @UseGuards(AgentAccessGuard, PermissionsGuard, LeadPermissionGuard)
  @Delete(ENDPOINTS.LEADS.DELETE_LEAD)
  async deleteLead(@Param('publicId', UUIDValidationPipe) publicId: string) {
    return;
  }
}
