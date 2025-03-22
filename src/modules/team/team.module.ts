import { Module } from '@nestjs/common';
import { TeamsController } from '@/modules/team/controllers/teams.controller';
import { TeamRepository } from '@/modules/team/repositories/team.repository';
import { TeamService } from '@/modules/team/services/team.service';
import { AuthRedisModule, AuthRedisService } from '@/shared/services/redis/auth-redis';
import { ValidationModule, ValidationService } from '@/shared/services/validation';
import { MediaModule } from '@/modules/media';
import { MediaService } from '@/modules/media/services/media.service';

@Module({
  imports: [AuthRedisModule, ValidationModule, MediaModule],
  controllers: [TeamsController],
  providers: [TeamService, TeamRepository, AuthRedisService, ValidationService, MediaService],
  exports: [TeamRepository],
})
export class TeamModule {}
