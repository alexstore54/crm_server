import { Injectable, UnauthorizedException } from '@nestjs/common';
import { SessionsService } from '@/shared/services/sessions/sessions.service';
import { GatewayService } from '@/shared/gateway';
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
import { ERROR_MESSAGES } from '@/shared/constants/errors';
import { AuthGateway } from '@/modules/auth/geateway';

@Injectable()
export class AuthService {
  constructor(
    private readonly sessionService: SessionsService,
    private readonly gatewayService: GatewayService,
    private readonly authGateway: AuthGateway,
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
      isOnline: true,
      refreshToken: tokens.refreshToken,
      //#TODO - make publicID
      userId: user.id.toString(),
    });

    const session = await this.sessionService.saveUserSession(createSessionInput);

    //logout from all devices except current
    if (userType === 'agent') {
      //TODO: make publicID
      await this.authGateway.logoutFromAllDevicesExceptCurrent(user.id.toString(), sessionUUID);
    }

    return tokens;
  }

  public async logout(userPublicId: string, sessionUUID: SessionUUID) {
    await this.sessionService.deleteUserSession(userPublicId, sessionUUID);
    this.gatewayService.removeClient(sessionUUID);
  }

  public async refreshTokens(
    payload: AgentAuthPayload | CustomerAuthPayload,
    refreshToken: string,
  ): Promise<AuthTokens> {
    const { sub: userPublicId, sessionUUID } = payload;

    const session = await this.sessionService.getUserSession(userPublicId, sessionUUID);
    if (!session) {
      throw new UnauthorizedException(ERROR_MESSAGES.ACCESS_DENIED);
    }
    const isTokensCompare = await BcryptHelper.compare(refreshToken, session.hashedRefreshToken);

    if (!isTokensCompare) {
      throw new UnauthorizedException(ERROR_MESSAGES.ACCESS_DENIED);
    }

    const tokens = await this.tokensService.getTokens(payload);
    const newHashedToken = await BcryptHelper.hash(tokens.refreshToken);
    await this.sessionService.updateUserSession(userPublicId, sessionUUID, {
      ...session,
      refreshToken: newHashedToken,
    });

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
