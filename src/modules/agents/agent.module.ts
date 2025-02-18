import { Module } from '@nestjs/common';
import { AgentService } from '@/modules/agents/services/agent.service';
import { AgentController } from '@/modules/agents/controllers/agent.controller';
import { AgentRepository } from '@/modules/agents/repositories/agent.repository';

@Module({
  providers: [AgentService, AgentRepository],
  controllers: [AgentController],
  exports: [AgentRepository],
})
export class AgentModule {}
