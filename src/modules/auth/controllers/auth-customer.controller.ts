import { Body, Controller, Headers, Post, Req, Res } from '@nestjs/common';
import { SignInAgent } from '@/modules/auth/dto/agent/sign-in.dto';
import { Response } from 'express';
import { AuthTokens } from '@/shared/types/auth';
import { CookiesUtil } from '@/shared/utils';
import { SignInUser } from '@/modules/auth/dto/user/sign-in.dto';
import { AuthService } from '@/modules/auth/services';

@Controller('auth/users')
export class AuthCustomerController {
  constructor(
    private readonly authUserService: AuthUserService,
    private readonly authService: AuthService,
  ) {
  }

  @Post('sign-in')
  async signIn(
    @Body() body: SignInUser,
    @Headers('user-agent') userAgent: string,
    @Headers('fingerprint') fingerprint: string,
    @Res() res: Response,
  ) {
    const user = await this.authUserService.signIn(body);

    const tokens: AuthTokens = await this.authService.authenticate('customer', {
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
  async logout(
  ) {
    // this.authService.logout()
  }

  @Post('refresh')
  async refreshTokens(@Req() request: Request, @Res() response: Response) {
    ///
  }
}