import { Module } from '@nestjs/common';
import { TeamsController } from '@/modules/team/controllers/teams.controller';
import { TeamRepository } from '@/modules/team/repositories/team.repository';
import { TeamService } from '@/modules/team/services/team.service';
import { AuthRedisModule, AuthRedisService } from '@/shared/services/redis/auth-redis';

@Module({
  imports: [AuthRedisModule],
  controllers: [TeamsController],
  providers: [TeamService, TeamRepository, AuthRedisService],
  exports: [TeamRepository],
})
export class TeamModule {}
