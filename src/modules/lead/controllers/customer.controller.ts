import { Controller, Get, Patch, Req, UseGuards } from '@nestjs/common';
import { ENDPOINTS } from '@/shared/constants/endpoints';
import { LeadsService } from '@/modules/lead/services';
import { CustomerAccessGuard } from '@/common/guards/tokens/customer';
import { RequestWithCustomerPayload } from '@/shared/types/auth';
import { LeadForClient } from '@/shared/types/user';

@Controller(ENDPOINTS.CUSTOMER.BASE)
export class CustomerController {
  constructor(private readonly leadsService: LeadsService) {}

  @UseGuards(CustomerAccessGuard)
  @Get(ENDPOINTS.CUSTOMER.GET_ME)
  async getMe(@Req() req: RequestWithCustomerPayload): Promise<LeadForClient> {
    const result = await this.leadsService.getOneByPublicId(req.user.sub);
    return result.lead;
  }

  @UseGuards(CustomerAccessGuard)
  @Patch(ENDPOINTS.CUSTOMER.UPDATE_ME)
  async updateMe(@Req() req: RequestWithCustomerPayload) {}
}
