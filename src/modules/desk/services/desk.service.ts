import { Injectable, NotFoundException } from '@nestjs/common';
import { Desk, Team } from '@prisma/client';
import { CreateDesk, UpdateDesk } from '@/modules/desk/dto/desks';
import { DeskRepository } from '@/modules/desk/repositories';
import { MediaImagesService } from '@/modules/media/services/media-images.service';
import { MediaDir, UpdateMediaParams } from '@/shared/types/media';

@Injectable()
export class DeskService {
  constructor(
    private readonly deskRepository: DeskRepository,
    private readonly mediaService: MediaImagesService,
  ) {}

  public async updateDesk(
    publicId: string,
    body: UpdateDesk,
    updateAvatarParams: UpdateMediaParams,
  ): Promise<Desk> {
    const { isAvatarRemoved, file } = updateAvatarParams;
    const operatedFile = isAvatarRemoved ? null : file;

    const avatarURL = this.mediaService.setOperationImage({
      name: 'avatar',
      file: operatedFile,
      publicId,
      dir: MediaDir.DESKS,
    });

    const desk = await this.deskRepository.updateOne(publicId, body, avatarURL);

    if (avatarURL) {
      await this.mediaService.saveImage();
    } else if (!avatarURL && isAvatarRemoved) {
      await this.mediaService.removeImage();
    }
    return desk;
  }

  public async getOne(publicId: string): Promise<Desk> {
    const desk = await this.deskRepository.findOneByPublicId(publicId);
    if (!desk) throw new NotFoundException();
    return desk;
  }

  public async createOne(data: CreateDesk, file?: Express.Multer.File): Promise<Desk> {
    let desk: Desk = await this.deskRepository.createOne(data);
    const avatarURL = this.mediaService.setOperationImage({
      name: 'avatar',
      file,
      publicId: desk.publicId,
      dir: MediaDir.DESKS,
    });

    if (avatarURL) {
      desk = await this.deskRepository.updateOne(desk.publicId, {}, avatarURL);
      await this.mediaService.saveImage();
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