import { Injectable, UnauthorizedException } from '@nestjs/common';
import { SessionsService } from '@/shared/services/redis/sessions/sessions.service';
import { GatewayService } from '@/shared/gateway';
import { AgentAuthPayload, AuthTokens, CustomerAuthPayload } from '@/shared/types/auth';
import { AuthenticateArgs, MakeSessionArgs, UserType } from '@/modules/auth/types/auth-args.type';
import { BcryptHelper } from '@/shared/helpers';
import { v4 as uuidv4 } from 'uuid';
import { TokensService } from '@/modules/auth/services/tokens.service';
import { ERROR_MESSAGES } from '@/shared/constants/errors';
import { AuthGateway } from '@/modules/auth/geateway';
import { CreateSessionInput, PayloadUUID } from '@/shared/types/redis';

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
    const payloadUUID: PayloadUUID = uuidv4();

    const payload =
      userType === 'agent'
        ? this.mapAgentPayload(user, payloadUUID)
        : this.mapCustomerPayload(user, payloadUUID);

    const tokens = await this.tokensService.getTokens({ ...payload });

    const createSessionInput = await this.makeSession({
      payloadUUID: payloadUUID,
      fingerprint,
      userAgent,
      isOnline: true,
      refreshToken: tokens.refreshToken,
      userId: user.publicId,
    });

    const session = await this.sessionService.saveUserSession(createSessionInput);

    //logout from all devices except current
    if (userType === 'agent') {
      await this.authGateway.logoutFromAllDevicesExceptCurrent(user.publicId, payloadUUID);
    }

    return tokens;
  }

  public async logout(userPublicId: string, payloadUUID: PayloadUUID) {
    await this.sessionService.deleteUserSession(userPublicId, payloadUUID);
    this.gatewayService.removeClient(payloadUUID);
  }

  public async refreshTokens(
    payload: AgentAuthPayload | CustomerAuthPayload,
    refreshToken: string,
  ): Promise<AuthTokens> {
    const { sub: userPublicId, payloadUUID } = payload;

    const session = await this.sessionService.getUserSession(userPublicId, payloadUUID);
    if (!session) {
      throw new UnauthorizedException(ERROR_MESSAGES.ACCESS_DENIED);
    }
    const isTokensCompare = await BcryptHelper.compare(refreshToken, session.hashedRefreshToken);

    if (!isTokensCompare) {
      throw new UnauthorizedException(ERROR_MESSAGES.ACCESS_DENIED);
    }

    const tokens = await this.tokensService.getTokens(payload);
    const newHashedToken = await BcryptHelper.hash(tokens.refreshToken);
    await this.sessionService.updateUserSession(userPublicId, payloadUUID, {
      ...session,
      refreshToken: newHashedToken,
    });

    return tokens;
  }

  private async makeSession(args: MakeSessionArgs): Promise<CreateSessionInput> {
    const { refreshToken, payloadUUID, isOnline, userId, userAgent, fingerprint } = args;
    const hashedRefreshToken = await BcryptHelper.hash(refreshToken);

    return {
      fingerprint,
      hashedRefreshToken,
      isOnline,
      payloadUUID: payloadUUID,
      userId,
      userAgent,
    };
  }

  private mapAgentPayload(user: any, payloadUUID: PayloadUUID): AgentAuthPayload {
    return {
      descId: user.descId,
      routeAccess: user.routeAccess,
      payloadUUID,
      sub: user.publicId,
    };
  }

  private mapCustomerPayload(user: any, payloadUUID: PayloadUUID): CustomerAuthPayload {
    return {
      payloadUUID,
      sub: user.publicId,
    };
  }
}
