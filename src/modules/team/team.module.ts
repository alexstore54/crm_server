import { Module } from '@nestjs/common';
import { TeamsController } from '@/modules/team/controllers/teams.controller';
import { TeamRepository } from '@/modules/team/repositories/team.repository';
import { TeamService } from '@/modules/team/services/team.service';

@Module({
  controllers: [TeamsController],
  providers: [TeamService, TeamRepository],
  exports: [TeamRepository],
})
export class TeamModule {}
