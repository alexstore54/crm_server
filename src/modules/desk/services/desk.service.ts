import { Injectable, NotFoundException } from '@nestjs/common';
import { Desk, Team } from '@prisma/client';
import { CreateDesk, UpdateDesk } from '@/modules/desk/dto/desks';
import { DeskRepository } from '@/modules/desk/repositories';
import { MediaImagesService } from '@/modules/media/services/media-images.service';
import { MediaDir, MediaPrefix } from '@/shared/types/media';

@Injectable()
export class DeskService {
  constructor(
    private readonly deskRepository: DeskRepository,
    private readonly mediaService: MediaImagesService,
  ) {}

  public async updateDesk(
    publicId: string,
    body: UpdateDesk,
    file?: Express.Multer.File,
  ): Promise<Desk> {
    const avatarURL = await this.mediaService.save({
      publicId,
      name: 'avatar',
      file,
      dir: MediaDir.DESKS,
      prefix: MediaPrefix.IMAGES,
    });
    return this.deskRepository.updateOne(publicId, body, avatarURL);
  }

  public async getOne(publicId: string): Promise<Desk> {
    const desk = await this.deskRepository.findOneByPublicId(publicId);
    if (!desk) throw new NotFoundException();
    return desk;
  }

  public async createOne(data: CreateDesk, file?: Express.Multer.File): Promise<Desk> {
    const desk = await this.deskRepository.createOne(data);
    const avatarURL = await this.mediaService.save({
      name: 'avatar',
      publicId: desk.publicId,
      file,
      prefix: MediaPrefix.IMAGES,
      dir: MediaDir.DESKS,
    });
    if (avatarURL) {
      return this.deskRepository.updateOne(desk.publicId, {}, avatarURL);
    }
    return desk;
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