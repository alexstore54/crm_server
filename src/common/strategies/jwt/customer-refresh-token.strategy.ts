import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { STRATEGIES_NAMES } from '@/shared/constants/auth';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';
import { AgentAuthPayload, CustomerAuthPayload } from '@/shared/types/auth';
import { ERROR_MESSAGES } from '@/shared/constants/errors';
import { customerAuthPayloadSchema } from '@/shared/schemas/auth-payload.schema';
import { configKeys } from '@/shared/schemas';
import { AuthUtil } from '@/shared/utils/auth/auth.util';
import { COOKIES } from '@/shared/constants/response';

@Injectable()
export class CustomerRefreshTokenStrategy extends PassportStrategy(
  Strategy,
  STRATEGIES_NAMES.CUSTOMER_REFRESH_TOKEN,
) {
  constructor(private configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req: Request) => {
          return req.cookies[COOKIES.REFRESH_TOKEN];
        },
      ]),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>(configKeys.JWT_SECRET) as string,
    });
  }

  async validate(payload: CustomerAuthPayload): Promise<CustomerAuthPayload> {
    AuthUtil.validateCustomerAuthPayload(payload);
    return {
      payloadUUID: payload.payloadUUID,
      sub: payload.sub,
    };
  }
}
