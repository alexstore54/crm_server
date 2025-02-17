import { Injectable } from '@nestjs/common';
import { SessionsService } from '@/shared/services/sessions/sessions.service';
import { ClientsGateway } from '@/shared/gateway';
import {
  AgentAuthPayload,
  AuthTokens,
  CreateSessionInput,
  CustomerAuthPayload,
  SessionUUID,
} from '@/shared/types/auth';
import { AuthenticateArgs, MakeSessionArgs, UserType } from '@/modules/auth/types/auth-args.type';
import { BcryptHelper } from '@/shared/helpers';
import { v4 as uuidv4 } from 'uuid';
import { TokensService } from '@/modules/auth/services/tokens.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly sessionService: SessionsService,
    private readonly clientService: ClientsGateway,
    private readonly tokensService: TokensService,
  ) {}

  public async authenticate(userType: UserType, args: AuthenticateArgs): Promise<AuthTokens> {
    const { user, userAgent, fingerprint } = args;
    const sessionUUID: SessionUUID = uuidv4();

    const payload =
      userType === 'agent'
        ? this.mapAgentPayload(user, sessionUUID)
        : this.mapCustomerPayload(user, sessionUUID);

    const tokens = await this.tokensService.getTokens({ ...payload });

    const createSessionInput = await this.makeSession({
      sessionUUID: sessionUUID,
      fingerprint,
      userAgent,
      isOnline: false,
      refreshToken: tokens.refreshToken,
      userId: user.publicId,
    });

    const session = await this.sessionService.saveUserSession(createSessionInput);

    // await this.clientService.connect(user.publicId, sessionUUID, socketClient);

    return tokens;
  }

  private async makeSession(args: MakeSessionArgs): Promise<CreateSessionInput> {
    const { refreshToken, sessionUUID, isOnline, userId, userAgent, fingerprint } = args;
    const hashedRefreshToken = await BcryptHelper.hash(refreshToken);

    return {
      fingerprint,
      hashedRefreshToken,
      isOnline,
      sessionUUID,
      userId,
      userAgent,
    };
  }

  private mapAgentPayload(user: any, sessionUUID: SessionUUID): AgentAuthPayload {
    return {
      descId: user.descId,
      role: user.role,
      sessionUUID,
      sub: user.publicId,
    };
  }

  private mapCustomerPayload(user: any, sessionUUID: SessionUUID): CustomerAuthPayload {
    return {
      sessionUUID,
      sub: user.publicId,
    };
  }
}