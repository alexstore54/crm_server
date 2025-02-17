import { Body, Controller, Get, Post } from '@nestjs/common';
import { AuthAgentService } from '@/modules/auth/services/auth-agent.service';
import { SignInAgent } from '@/modules/auth/dto/agent/sign-in.dto';
import { AuthTokens } from '@/shared/types/auth';

@Controller('auth/agents')
export class AuthAgentController {
  constructor(private readonly authAgentService: AuthAgentService) {
  }

  @Post('sign-in')
  async signIn(@Body() body: SignInAgent) {
    const tokens: AuthTokens = this.authAgentService.signIn(body);
  }

  @Post('sign-up')
  async signUp() {
    return 'Sign Up';
  }

  @Post('logout')
  async logout() {

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