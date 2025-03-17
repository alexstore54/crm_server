import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';
import { STRATEGIES_NAMES } from '@/shared/constants/auth';
import { configKeys } from '@/shared/schemas';
import { AuthUtil } from '@/shared/utils/auth/auth.util';
import { AgentAuthPayload } from '@/shared/types/auth';
import { COOKIES } from 'shared/constants/endpoints';

@Injectable()
export class AgentAccessTokenStrategy extends PassportStrategy(
  Strategy,
  STRATEGIES_NAMES.AGENT_ACCESS_TOKEN,
) {
  constructor(private configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req: Request) => {
          return req.cookies[COOKIES.ACCESS_TOKEN];
        },
      ]),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>(configKeys.JWT_SECRET) as string,
    });
  }

  async validate(payload: AgentAuthPayload): Promise<AgentAuthPayload> {
    AuthUtil.validateAgentAuthPayload(payload);
    return {
      sub: payload.sub,
      desksPublicId: payload.desksPublicId,
      teamsPublicId: payload.teamsPublicId,
      payloadUUID: payload.payloadUUID,
    };
  }
}
