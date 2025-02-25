import { Module } from '@nestjs/common';
import { AgentService } from '@/modules/agents/services/agent.service';
import { AgentController } from '@/modules/agents/controllers/agent.controller';
import { AgentRepository } from '@/modules/agents/repositories/agent.repository';
import { AgentAccessGuard, ModeratorGuard } from '@/common/guards/tokens/agent';
import { UserModule } from '../users/user.module';

@Module({
  imports: [UserModule],
  providers: [AgentService, AgentRepository, AgentAccessGuard, ModeratorGuard],
  controllers: [AgentController],
  exports: [AgentRepository],
})
export class AgentModule {}
