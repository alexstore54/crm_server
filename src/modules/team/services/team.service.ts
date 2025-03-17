import { Injectable, NotFoundException } from '@nestjs/common';
import { TeamRepository } from '@/modules/team/repositories/team.repository';
import { CreateTeam, UpdateTeam } from '@/modules/team/dto';
import { Team } from '@prisma/client';

@Injectable()
export class TeamService {
  constructor(private readonly teamRepository: TeamRepository) {}

  public async createOne(data: CreateTeam) {
    // return this.teamRepository.createOne(data);
  }

  public async updateOne(teamPublicId: string, data: UpdateTeam) {
    // return this.teamRepository.updateOne(teamPublicId, data);
  }

  public async deleteOne(teamPublicId: string) {
    // return this.teamRepository.deleteOne(teamPublicId);
  }

  public async getTeamByPublicId(teamPublicId: string): Promise<Team> {
    const team: Team | null = await this.teamRepository.findOneByPublicId(teamPublicId);
    if (!team) {
      throw new NotFoundException();
    }
    return team;
  }
}
