import { Injectable, NotFoundException } from '@nestjs/common';
import { TeamRepository } from '@/modules/team/repositories/team.repository';
import { CreateTeam, UpdateTeam } from '@/modules/team/dto';
import { Team } from '@prisma/client';
import { MediaImagesService } from '@/modules/media/services/media-images.service';
import { MediaDir, UpdateMediaParams } from '@/shared/types/media';
import { FullTeam } from '@/shared/types/team';

@Injectable()
export class TeamService {
  constructor(
    private readonly teamRepository: TeamRepository,
    private readonly mediaService: MediaImagesService,
  ) {}

  public async createOne(data: CreateTeam, file?: Express.Multer.File): Promise<Team> {
    let team: Team = await this.teamRepository.createOne(data);
    const avatarURL = this.mediaService.setOperationImage({
      name: 'avatar',
      publicId: team.publicId,
      file,
      dir: MediaDir.TEAMS,
    });

    if (avatarURL) {
      team = await this.teamRepository.updateOneByPublicId(team.publicId, {}, avatarURL);
      await this.mediaService.saveImage();
    }
    return team;
  }

  public async updateOne(
    teamPublicId: string,
    data: UpdateTeam,
    updateAvatarParams: UpdateMediaParams,
  ): Promise<Team> {
    const { isAvatarRemoved, file } = updateAvatarParams;

    const operatedFile = isAvatarRemoved ? null : file;

    const avatarURL = this.mediaService.setOperationImage({
      name: 'avatar',
      file: operatedFile,
      publicId: teamPublicId,
      dir: MediaDir.TEAMS,
    });

    const team = await this.teamRepository.updateOneByPublicId(teamPublicId, data, avatarURL);
    if (team) {
      if (avatarURL) {
        await this.mediaService.saveImage();
      } else if (avatarURL === null && isAvatarRemoved) {
        await this.mediaService.removeImage();
      }
    }
    return team;
  }

  public async getManyTeams(page: number, limit: number) {
    return this.teamRepository.findMany(page, limit);
  }

  public async deleteOne(teamPublicId: string) {
    return this.teamRepository.deleteOneByPublicId(teamPublicId);
  }

  public async getTeamByPublicId(teamPublicId: string): Promise<FullTeam> {
    return  this.teamRepository.findOneFullByPublicId(teamPublicId);
  }
}
