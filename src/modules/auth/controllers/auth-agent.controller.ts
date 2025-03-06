import { Body, Controller, Headers, Post, Req, Res, UseGuards } from '@nestjs/common';
import { AuthAgentService } from '@/modules/auth/services/auth-agent.service';
import { SignInAgent } from '@/modules/auth/dto/agent/sign-in.dto';
import { Response } from 'express';
import { AuthService } from '@/modules/auth/services';
import { CookiesUtil } from '@/shared/utils';
import { AuthTokens } from '@/shared/types/auth';
import { RequestWithAgentPayload } from '@/shared/types/auth/request-auth.type';
import { RESPONSE_STATUS } from '@/shared/constants/response';
import { AgentRefreshGuard } from '@/common/guards/tokens/agent';

@Controller('auth/agent')
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
    console.log(body)
    const result = await this.authAgentService.validate(body);
    console.log(result)
    const tokens: AuthTokens = await this.authService.authenticateAgent({
      ...result,
      userAgent,
      fingerprint,
    });

    CookiesUtil.setAuthTokens(res, tokens.accessToken, tokens.refreshToken);

    return res.status(200).send(RESPONSE_STATUS.SUCCESS);
  }

  @UseGuards(AgentRefreshGuard)
  @Post('logout')
  async logout(@Req() request: RequestWithAgentPayload, @Res() response: Response) {
    const payload = request.user;
    await this.authService.logout(payload.sub, payload.payloadUUID);
    CookiesUtil.clearAuthTokens(response);
    return response.status(200).send(RESPONSE_STATUS.SUCCESS);
  }

  @UseGuards(AgentRefreshGuard)
  @Post('refresh')
  async refreshTokens(@Req() request: RequestWithAgentPayload, @Res() response: Response) {
    const payload = request.user;
    const refreshToken = request.cookies['refresh_token'];
    const tokens: AuthTokens = await this.authService.refreshTokens(payload, refreshToken);
    CookiesUtil.setAuthTokens(response, tokens.accessToken, tokens.refreshToken);
    return response.status(200).send(RESPONSE_STATUS.SUCCESS);
  }
}
