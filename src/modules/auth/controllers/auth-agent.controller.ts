import { Body, Controller, Headers, Post, Req, Res, UnauthorizedException } from '@nestjs/common';
import { AuthAgentService } from '@/modules/auth/services/auth-agent.service';
import { SignInAgent } from '@/modules/auth/dto/agent/sign-in.dto';
import { Response } from 'express';
import { AuthService } from '@/modules/auth/services';
import { CookiesUtil } from '@/shared/utils';
import { AuthTokens } from '@/shared/types/auth';
import { Agent } from '@prisma/client';
import { ERROR_MESSAGES } from '@/shared/constants/errors';

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
    const agent: Agent | null = await this.authAgentService.signIn(body);

    if (!agent) {
      throw new UnauthorizedException(ERROR_MESSAGES.INVALID_CREDS);
    }

    const tokens: AuthTokens = await this.authService.authenticate('agent', {
      user: agent,
      userAgent,
      fingerprint,
    });

    CookiesUtil.setAuthTokens(res, tokens.accessToken, tokens.refreshToken);

    return res.status(200).send('success');
  }

  @Post('logout')
  async logout() {
    // this.authService.logout()
  }

  @Post('refresh')
  async refreshTokens(@Req() request: Request, @Res() response: Response) {
    ///
  }
}