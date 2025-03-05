import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';
import { STRATEGIES_NAMES } from '@/shared/constants/auth';
import { configKeys } from '@/shared/schemas';
import { AuthUtil } from '@/shared/utils/auth/auth.util';
import { AgentAuthPayload } from '@/shared/types/auth';

@Injectable()
export class AgentRefreshTokenStrategy extends PassportStrategy(
  Strategy,
  STRATEGIES_NAMES.AGENT_REFRESH_TOKEN,
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

  async validate(payload: AgentAuthPayload): Promise<AgentAuthPayload> {
    AuthUtil.validateAgentAuthPayload(payload);
    return { ...payload };
  }
}
