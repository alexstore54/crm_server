import { Module } from '@nestjs/common';
import { DeskService } from '@/modules/desk/services/desk.service';
import { DesksController } from '@/modules/desk/controllers/desks.controller';
import { AuthRedisModule } from '@/shared/services/redis/auth-redis';
import { ValidationModule } from '@/shared/services/validation';
import { DeskRepository } from '@/modules/desk/repositories/desk.repository';
import { ShiftService } from '@/modules/desk/services/shift.service';
import { DeskAdminRepository } from '@/modules/desk/repositories';

@Module({
  imports: [AuthRedisModule, ValidationModule],
  controllers: [DesksController],
  providers: [DeskService, ShiftService, DeskRepository, DeskAdminRepository],
  exports: [DeskRepository, DeskAdminRepository],
})
export class TeamsModule {}