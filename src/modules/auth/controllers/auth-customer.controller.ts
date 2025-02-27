import { Body, Controller, Headers, Post, Req, Res, UseGuards } from '@nestjs/common';
import { Response } from 'express';
import { AuthTokens, RequestWithCustomerPayload } from '@/shared/types/auth';
import { CookiesUtil } from '@/shared/utils';
import { AuthService } from '@/modules/auth/services';
import { AuthCustomerService } from '@/modules/auth/services/auth-customer.service';
import { FullCustomer } from '@/shared/types/user';
import { RESPONSE_STATUS } from '@/shared/constants/response';
import { SignInCustomer, SignUpCustomer } from '@/modules/auth/dto/customer';
import { CustomerRefreshGuard } from '@/common/guards/tokens/customer';

@Controller('auth/customer')
export class AuthCustomerController {
  constructor(
    private readonly authCustomerService: AuthCustomerService,
    private readonly authService: AuthService,
  ) {}

  @Post('sign-in')
  async signIn(
    @Body() body: SignInCustomer,
    @Headers('user-agent') userAgent: string,
    @Headers('fingerprint') fingerprint: string,
    @Res() res: Response,
  ) {
    const customer: FullCustomer = await this.authCustomerService.validate(body);

    const tokens: AuthTokens = await this.authService.authenticate('customer', {
      user: customer,
      userAgent,
      fingerprint,
    });

    CookiesUtil.setAuthTokens(res, tokens.accessToken, tokens.refreshToken);

    return res.status(200).send(RESPONSE_STATUS.SUCCESS);
  }

  @Post('sign-up')
  async signUp(
    @Body() body: SignUpCustomer,
    @Headers('user-agent') userAgent: string,
    @Headers('fingerprint') fingerprint: string,
    @Res() res: Response,
  ) {
    
    const customer: FullCustomer = await this.authCustomerService.signUp(body);
    const tokens: AuthTokens = await this.authService.authenticate('customer', {
      user: customer,
      userAgent,
      fingerprint,
    });

    CookiesUtil.setAuthTokens(res, tokens.accessToken, tokens.refreshToken);
    return res.status(201).send(RESPONSE_STATUS.SUCCESS);
  }

  @UseGuards(CustomerRefreshGuard)
  @Post('logout')
  async logout(@Req() request: RequestWithCustomerPayload, @Res() response: Response) {
    const user = request.user;
    await this.authService.logout(user.sub, user.sessionUUID);
    CookiesUtil.clearAuthTokens(response);
    return response.status(200).send(RESPONSE_STATUS.SUCCESS);
  }

  @UseGuards(CustomerRefreshGuard)
  @Post('refresh')
  async refreshTokens(@Req() request: RequestWithCustomerPayload, @Res() response: Response) {
    const payload = request.user;
    const refreshToken = request.cookies['refresh_token'];
    const tokens: AuthTokens = await this.authService.refreshTokens(payload, refreshToken);
    CookiesUtil.setAuthTokens(response, tokens.accessToken, tokens.refreshToken);
    return response.status(200).send(RESPONSE_STATUS.SUCCESS);
  }
}
