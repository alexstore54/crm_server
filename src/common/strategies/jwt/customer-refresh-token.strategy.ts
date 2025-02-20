import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { STRATEGIES_NAMES } from '@/shared/constants/auth';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';
import { CustomerAuthPayload } from '@/shared/types/auth';
import { ERROR_MESSAGES } from '@/shared/constants/errors';
import { customerAuthPayloadSchema } from '@/shared/schemas/auth-payload.schema';
import { configKeys } from '@/shared/schemas';

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

  async validate(payload: CustomerAuthPayload): Promise<CustomerAuthPayload> {
    const { error } = customerAuthPayloadSchema.validate(payload);
    if (error) {
      throw new UnauthorizedException(ERROR_MESSAGES.INVALID_TOKEN);
    }
    return {
      ...payload,
    };
  }
}
