import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { AgentAuthPayload } from '@/shared/types/auth';
import { Request } from 'express';
import { STRATEGIES_NAMES } from '@/shared/constants/auth';
import { ERROR_MESSAGES } from '@/shared/constants/errors';
import { configKeys } from '@/shared/schemas';
import { agentAuthPayloadSchema } from '@/shared/schemas/auth-payload.schema';
import { AuthUtil } from '@/shared/utils/auth/auth.util';

@Injectable()
export class AgentAccessTokenStrategy extends PassportStrategy(
  Strategy,
  STRATEGIES_NAMES.AGENT_ACCESS_TOKEN,
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

  async validate(payload: AgentAuthPayload): Promise<AgentAuthPayload> {
    AuthUtil.validateAgentAuthPayload(payload);
    return {
      ...payload,
    };
  }
}
