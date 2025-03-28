import { Injectable, NotFoundException } from '@nestjs/common';
import { LeadRepository } from '@/modules/lead/repositories';
import { FullLead, LeadForClient, PrismaLead } from 'shared/types/user';
import { UsersUtil } from '@/shared/utils';

@Injectable()
export class LeadsService {
  constructor(private readonly leadsRepository: LeadRepository) {}

  public async getOneByPublicId(publicId: string): Promise<FullLead> {
    const result: PrismaLead | null = await this.leadsRepository.findOneFullByPublicId(publicId);
    if (!result) {
      throw new NotFoundException();
    }

    return UsersUtil.mapPrismaLeadToFullLead(result);
  }
  public async getManyLeads(page: number, limit: number): Promise<LeadForClient[]> {
    return await this.leadsRepository.getAll(page, limit);
  }
}
