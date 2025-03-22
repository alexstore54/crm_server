import { Injectable, NotFoundException } from '@nestjs/common';
import { TeamRepository } from '@/modules/team/repositories/team.repository';
import { CreateTeam, UpdateTeam } from '@/modules/team/dto';
import { Team } from '@prisma/client';
import { MediaService } from '@/modules/media/services/media.service';
import { MediaDir, MediaPrefix } from '@/shared/types/media';

@Injectable()
export class TeamService {
  constructor(
    private readonly teamRepository: TeamRepository,
    private readonly mediaService: MediaService,
  ) {}

  public async createOne(data: CreateTeam, file?: Express.Multer.File): Promise<Team> {
    const team = await this.teamRepository.createOne(data);
    const avatarURL = await this.mediaService.save({
      name: 'avatar',
      publicId: team.publicId,
      file,
      prefix: MediaPrefix.PICTURES,
      dir: MediaDir.TEAMS,
    });

    if (avatarURL) {
      return this.teamRepository.updateOneByPublicId(team.publicId, {}, avatarURL);
    }
    return team;
  }

  public async updateOne(
    teamPublicId: string,
    data: UpdateTeam,
    file?: Express.Multer.File,
  ): Promise<Team> {
    const avatarURL = await this.mediaService.save({
      name: 'avatar',
      publicId: teamPublicId,
      file,
      dir: MediaDir.TEAMS,
      prefix: MediaPrefix.PICTURES,
    });
    return this.teamRepository.updateOneByPublicId(teamPublicId, data, avatarURL);
  }

  public async getManyTeams(page: number, limit: number) {
    return this.teamRepository.findMany(page, limit);
  }

  public async deleteOne(teamPublicId: string) {
    return this.teamRepository.deleteOneByPublicId(teamPublicId);
  }

  public async getTeamByPublicId(teamPublicId: string): Promise<Team> {
    const team: Team | null = await this.teamRepository.findOneByPublicId(teamPublicId);
    if (!team) {
      throw new NotFoundException();
    }
    return team;
  }
}
