import { Body, Controller, Get, Headers, Post, Res } from '@nestjs/common';
import { AuthAgentService } from '@/modules/auth/services/auth-agent.service';
import { SignInAgent } from '@/modules/auth/dto/agent/sign-in.dto';
import { Response } from 'express';
import { AuthService } from '@/modules/auth/services';
import { CookiesUtil } from '@/shared/utils';
import { AuthTokens } from '@/shared/types/auth';

@Controller('auth/agents')
export class AuthAgentController {
  constructor(
    private readonly authAgentService: AuthAgentService,
    private readonly authService: AuthService,
  ) {}

  @Post('sign-in')
  async signIn(
    @Body() body: SignInAgent,
    @Headers('user-agent') userAgent: string,
    @Headers('fingerprint') fingerprint: string,
    @Res() res: Response,
  ) {
    const user = await this.authAgentService.signIn(body);

    const tokens: AuthTokens = await this.authService.authenticate('agent', {
      user,
      userAgent,
      fingerprint,
    });

    CookiesUtil.setAuthTokens(res, tokens.accessToken, tokens.refreshToken);

    return res.status(200).send('success');
  }

  @Post('sign-up')
  async signUp(
    @Body() body: SignInAgent,
    @Headers('user-agent') userAgent: string,
    @Headers('fingerprint') fingerprint: string,
    @Res() res: Response,
  ) {
    const user = await this.authAgentService.signUp(body);
    const tokens: AuthTokens = await this.authService.authenticate('agent', {
      user,
      userAgent,
      fingerprint,
    });
  }

  @Post('logout')
  async logout() {}

  @Get('me')
  async getAgentProfile() {
    return 'Agent Profile';
  }

  @Get(':id')
  async getAgentProfileById() {
    return 'Agent Profile';
  }
}