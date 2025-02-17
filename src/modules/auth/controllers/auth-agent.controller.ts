import { BadRequestException, Body, Controller, Get, Post, Res } from '@nestjs/common';
import { AuthAgentService } from '@/modules/auth/services/auth-agent.service';
import { SignInAgent } from '@/modules/auth/dto/agent/sign-in.dto';
import { AuthTokens } from '@/shared/types/auth';
import { ERROR_MESSAGES } from '@/shared/constants/errors';
import { CookiesUtil } from '@/shared/utils';
import { Response } from 'express';
import { SessionsService } from '@/shared/services/sessions/sessions.service';

@Controller('auth/agents')
export class AuthAgentController {
  constructor(
    private readonly authAgentService: AuthAgentService,
    private readonly sessionService: SessionsService,
  ) {
  }

  @Post('sign-in')
  async signIn(@Body() body: SignInAgent, @Res() res: Response) {
    const result = await this.authAgentService.signIn(body);
    if (!tokens) {
      throw new BadRequestException(ERROR_MESSAGES.INVALID_CREDS);
    }
    CookiesUtil.setAuthTokens(res, tokens.accessToken, tokens.refreshToken);


    //#TODO: implement session logic

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