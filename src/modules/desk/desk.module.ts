import { Module } from '@nestjs/common';
import { DeskService } from '@/modules/desk/services/desk.service';
import { DesksController } from '@/modules/desk/controllers/desks.controller';
import { AuthRedisModule } from '@/shared/services/redis/auth-redis';
import { ValidationModule } from '@/shared/services/validation';
import { DeskRepository } from '@/modules/desk/repositories/desk.repository';
import { LeadManagerService } from '@/modules/desk/services/lead-manager.service';
import { LeadManagerRepository } from '@/modules/desk/repositories';

@Module({
  imports: [AuthRedisModule, ValidationModule],
  controllers: [DesksController],
  providers: [DeskService, LeadManagerService, DeskRepository, LeadManagerRepository],
  exports: [DeskRepository, LeadManagerRepository],
})
export class TeamsModule {}