import { Injectable, NotFoundException } from '@nestjs/common';
import { Lead } from '@prisma/client';
import { LeadRepository } from '@/modules/user/repositories';


@Injectable()
export class LeadsService {
  constructor(private readonly leadsRepository: LeadRepository) {}

  public async getOneByPublicId(publicId: string): Promise<Lead> {
    const lead = await this.leadsRepository.findOneFullById(publicId);

    if(!lead) {
      throw new NotFoundException();
    }

  }
}
