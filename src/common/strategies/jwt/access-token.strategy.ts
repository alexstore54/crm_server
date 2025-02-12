import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { AuthPayload } from '@/shared/types/auth';
import { Request } from 'express';
import { configKeys } from '@/common/config';
import { STRATEGIES_NAMES } from '@/shared/constants/auth';

@Injectable()
export class AccessTokenJWTStrategy extends PassportStrategy(
  Strategy,
  STRATEGIES_NAMES.ACCESS_TOKEN,
) {
  constructor(private configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req: Request) => {
          return req.cookies['access_token'];
        },
      ]),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>(configKeys.JWT_SECRET) as string,
    });
  }

  async validate(payload: AuthPayload) {
    if (!payload) {
      throw new UnauthorizedException('Invalid token');
    }
    return { userId: payload.sub, email: payload.email, role: payload.role };
  }
}
