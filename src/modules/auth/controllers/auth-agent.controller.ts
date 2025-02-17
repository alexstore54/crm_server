import { Controller, Get } from '@nestjs/common';
import { AuthAgentService } from '@/modules/auth/services/auth-agent.service';

@Controller('auth/agents')
export class AuthAgentController {
  constructor(private readonly authAgentService: AuthAgentService) {
  }

  @Get('me')
  async getAgentProfile() {
    return 'Agent Profile';
  }

  @Get(':id')
  async getAgentProfileById() {
    return 'Agent Profile';
  }
}