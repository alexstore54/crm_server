import { Injectable, NotFoundException } from '@nestjs/common';
import { TeamRepository } from '@/modules/team/repositories/team.repository';
import { CreateTeam, UpdateTeam } from '@/modules/team/dto';
import { Team } from '@prisma/client';

@Injectable()
export class TeamService {
  constructor(private readonly teamRepository: TeamRepository) {}

  public async createOne(data: CreateTeam): Promise<Team> {
    return this.teamRepository.createOne(data);
  }

  public async updateOne(teamPublicId: string, data: UpdateTeam): Promise<Team> {
    return this.teamRepository.updateOneByPublicId(teamPublicId, data);
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
