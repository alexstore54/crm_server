import { Controller, Post, UseGuards } from '@nestjs/common';
import { AgentAccessGuard, ModeratorGuard } from '@/common/guards/tokens/agent';

@Controller('agents')
export class AgentController {

}
