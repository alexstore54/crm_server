import { Module } from '@nestjs/common';
import { TeamsController } from '@/modules/team/controllers/teams.controller';
import { TeamRepository } from '@/modules/team/repositories/team.repository';
import { TeamService } from '@/modules/team/services/team.service';
import { AuthRedisModule, AuthRedisService } from '@/shared/services/redis/auth-redis';
import { ValidationModule, ValidationService } from '@/shared/services/validation';

@Module({
  imports: [AuthRedisModule, ValidationModule],
  controllers: [TeamsController],
  providers: [TeamService, TeamRepository, AuthRedisService, ValidationService],
  exports: [TeamRepository],
})
export class TeamModule {}
