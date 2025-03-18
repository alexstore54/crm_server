import { Injectable, NotFoundException } from '@nestjs/common';
import { Desk, Team } from '@prisma/client';
import { CreateDesk, UpdateDesk } from '@/modules/desk/dto/desks';
import { DeskRepository } from '@/modules/desk/repositories';

@Injectable()
export class DeskService {
  constructor(private readonly deskRepository: DeskRepository) {}

  public async updateDesk(publicId: string, body: UpdateDesk): Promise<Desk> {
    return this.deskRepository.updateOne(publicId, body);
  }

  public async getOne(publicId: string): Promise<Desk> {
    const desk = await this.deskRepository.findOneByPublicId(publicId);
    if (!desk) throw new NotFoundException();
    return desk;
  }

  public async createOne(data: CreateDesk): Promise<Desk> {
    return this.deskRepository.createOne(data);
  }

  public async getMany(page: number, limit: number): Promise<Desk[]> {
    return this.deskRepository.findMany(page, limit);
  }

  public async removeOne(publicId: string): Promise<Desk> {
    return this.deskRepository.deleteOneByPublicId(publicId);
  }

  public async getTeamsByPublicId(publicId: string): Promise<Team[]> {
    return this.deskRepository.findTeamsByDeskId(publicId);
  }
}