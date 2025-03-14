import { Body, Controller, Headers, Post, Req, Res, UseGuards } from '@nestjs/common';
import { AuthAgentService } from '@/modules/auth/services/auth-agent.service';
import { SignInAgent } from '@/modules/auth/dto/agent/sign-in.dto';
import { Response } from 'express';
import { AuthService } from '@/modules/auth/services';
import { CookiesUtil } from '@/shared/utils';
import { AuthTokens } from '@/shared/types/auth';
import { AgentRequest } from '@/shared/types/auth/request-auth.type';
import { COOKIES, ENDPOINTS, RESPONSE_STATUS } from 'shared/constants/endpoints';
import { AgentRefreshGuard } from '@/common/guards/tokens/agent';

@Controller(ENDPOINTS.AUTH_AGENT.BASE)
export class AuthAgentController {
  constructor(
    private readonly authAgentService: AuthAgentService,
    private readonly authService: AuthService,
  ) {}

  @Post(ENDPOINTS.AUTH_AGENT.SIGN_IN)
  async signIn(
    @Body() body: SignInAgent,
    @Headers('user-agent') userAgent: string,
    @Headers('fingerprint') fingerprint: string,
    @Res() res: Response,
  ) {
    const result = await this.authAgentService.validate(body);
    const tokens: AuthTokens = await this.authService.authenticateAgent({
      ...result,
      userAgent,
      fingerprint,
    });

    CookiesUtil.setAuthTokens(res, tokens.accessToken, tokens.refreshToken);

    return res.status(200).send(RESPONSE_STATUS.SUCCESS);
  }

  @UseGuards(AgentRefreshGuard)
  @Post(ENDPOINTS.AUTH_AGENT.REFRESH)
  async refreshTokens(@Req() request: AgentRequest, @Res() response: Response) {
    const payload = request.user;
    const refreshToken = request.cookies[COOKIES.REFRESH_TOKEN];
    const tokens: AuthTokens = await this.authService.refreshTokens(payload, refreshToken);
    CookiesUtil.setAuthTokens(response, tokens.accessToken, tokens.refreshToken);
    return response.status(200).send(RESPONSE_STATUS.SUCCESS);
  }

  @UseGuards(AgentRefreshGuard)
  @Post(ENDPOINTS.AUTH_AGENT.LOGOUT)
  async logout(@Req() request: AgentRequest, @Res() response: Response) {
    const payload = request.user;
    await this.authService.logout(payload.sub, payload.payloadUUID);
    CookiesUtil.clearAuthTokens(response);
    return response.status(200).send(RESPONSE_STATUS.SUCCESS);
  }


}
