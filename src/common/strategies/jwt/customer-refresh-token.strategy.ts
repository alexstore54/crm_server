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

@Injectable()
export class CustomerRefreshTokenStrategy extends PassportStrategy(
  Strategy,
  STRATEGIES_NAMES.CUSTOMER_REFRESH_TOKEN,
) {
  constructor(private configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req: Request) => {
          return req.cookies['refresh_token'];
        },
      ]),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>(configKeys.JWT_SECRET) as string,
    });
  }

  async validate(data: any): Promise<CustomerAuthPayload> {
    const payload = data[0] as AgentAuthPayload;

    AuthUtil.validateCustomerAuthPayload(payload);
    return {
      ...payload,
    };
  }
}
