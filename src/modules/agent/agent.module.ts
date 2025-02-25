import { Module } from '@nestjs/common';
import { AgentService } from '@/modules/agent/services/agent.service';
import { AgentController } from '@/modules/agent/controllers/agent.controller';
import { AgentRepository } from '@/modules/agent/repositories/agent.repository';
import { AgentAccessGuard, ModeratorGuard } from '@/common/guards/tokens/agent';
import { UserModule } from '@/modules/user/user.module';

@Module({
  imports: [UserModule],
  providers: [AgentService, AgentRepository, AgentAccessGuard, ModeratorGuard],
  controllers: [AgentController],
  exports: [AgentRepository],
})
export class AgentModule {}
