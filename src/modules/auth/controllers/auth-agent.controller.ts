import { BadRequestException, Body, Controller, Get, Headers, Post, Res } from '@nestjs/common';
import { AuthAgentService } from '@/modules/auth/services/auth-agent.service';
import { SignInAgent } from '@/modules/auth/dto/agent/sign-in.dto';
import { ERROR_MESSAGES } from '@/shared/constants/errors';
import { CookiesUtil } from '@/shared/utils';
import { Response } from 'express';
import { AuthService } from '@/modules/auth/services';
import { MakeSessionArgs } from '@/modules/auth/types/auth-args.type';

@Controller('auth/agents')
export class AuthAgentController {
  constructor(
    private readonly authAgentService: AuthAgentService,
    private readonly authService: AuthService,
  ) {
  }

  @Post('sign-in')
  async signIn(
    @Body() body: SignInAgent,
    @Headers('user-agent') userAgent: string,
    @Headers('fingerprint') fingerprint: string,
    @Res() res: Response,
  ) {
    const user = await this.authAgentService.signIn(body);
    if (!user) {
      throw new BadRequestException(ERROR_MESSAGES.INVALID_CREDS);
    }

    // Implement session logic
    const sessionArgs: MakeSessionArgs = {
      user: user,
      fingerprint,
      userAgent,
    };

    const sessionId = await this.authService.makeSession(sessionArgs);

    CookiesUtil.setAuthTokens(res, result.accessToken, result.refreshToken);
    return res.status(200).send('success');
  }


  @Post('sign-up')
  async signUp() {

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