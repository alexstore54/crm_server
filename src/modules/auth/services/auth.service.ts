import { Injectable, UnauthorizedException } from '@nestjs/common';
import { GatewayService } from '@/shared/gateway';
import { AgentAuthPayload, AuthTokens, CustomerAuthPayload } from '@/shared/types/auth';
import {
  AuthenticateAgentArgs,
  AuthenticateCustomerArgs,
  MakeSessionArgs,
} from '@/modules/auth/types/auth-args.type';
import { BcryptHelper } from '@/shared/helpers';
import { v4 as uuidv4 } from 'uuid';
import { TokensService } from '@/modules/auth/services/tokens.service';
import { ERROR_MESSAGES } from '@/shared/constants/errors';
import { AuthGateway } from '@/modules/auth/geateway';
import { CreateSessionInput, PayloadUUID } from '@/shared/types/redis';
import { AuthRedisService } from '@/shared/services/redis/auth-redis';
import { PermissionsUtil } from '@/shared/utils/permissions/permissions.util';
import { Agent } from '@prisma/client';
import { FullCustomer } from '@/shared/types/user';

@Injectable()
export class AuthService {
  constructor(
    private readonly authRedisService: AuthRedisService,
    private readonly gatewayService: GatewayService,
    private readonly authGateway: AuthGateway,
    private readonly tokensService: TokensService,
  ) {}

  public async authenticateAgent(args: AuthenticateAgentArgs): Promise<AuthTokens> {
    const { agent, userAgent, fingerprint, permissions } = args;
    const { publicId } = agent;
    const payloadUUID: PayloadUUID = uuidv4();

    const payload = this.mapAgentPayload(agent, payloadUUID, args.deskPublicId, args.teamPublicId);

    const tokens = await this.tokensService.getTokens({ ...payload });

    const createSessionInput = await this.makeSession({
      payloadUUID: payloadUUID,
      fingerprint,
      userAgent,
      isOnline: true,
      refreshToken: tokens.refreshToken,
      userId: agent.publicId,
    });

    await this.authRedisService.saveAgent({
      agentPublicId: publicId,
      payloadUUID,
      sessionInput: { ...createSessionInput },
      permissionsInput: {
        permissions,
      },
    });
    await this.authGateway.logoutFromAllDevicesExceptCurrent(agent.publicId, payloadUUID);
    return tokens;
  }

  public async authenticateCustomer(args: AuthenticateCustomerArgs): Promise<AuthTokens> {
    const { customer, userAgent, fingerprint } = args;
    const { publicId } = customer;
    const payloadUUID: PayloadUUID = uuidv4();

    const payload = this.mapCustomerPayload(customer, payloadUUID);
    const tokens = await this.tokensService.getTokens({ ...payload });

    const createSessionInput = await this.makeSession({
      payloadUUID: payloadUUID,
      fingerprint,
      userAgent,
      isOnline: true,
      refreshToken: tokens.refreshToken,
      userId: customer.publicId,
    });

    await this.authRedisService.saveCustomer({
      customerPublicId: publicId,
      payloadUUID,
      sessionInput: { ...createSessionInput },
    });

    return tokens;
  }

  public async logout(userPublicId: string, payloadUUID: PayloadUUID) {
    await this.authRedisService.deleteOneSession(userPublicId, payloadUUID);
    this.gatewayService.removeClient(payloadUUID);
  }

  public async refreshTokens(
    payload: AgentAuthPayload | CustomerAuthPayload,
    refreshToken: string,
  ): Promise<AuthTokens> {
    const { sub: userPublicId, payloadUUID } = payload;

    const session = await this.authRedisService.getOneSession(userPublicId, payloadUUID);
    if (!session) {
      throw new UnauthorizedException(ERROR_MESSAGES.ACCESS_DENIED);
    }
    const isTokensCompare = await BcryptHelper.compare(refreshToken, session.hashedRefreshToken);

    if (!isTokensCompare) {
      throw new UnauthorizedException(ERROR_MESSAGES.ACCESS_DENIED);
    }

    const tokens = await this.tokensService.getTokens(payload);
    const newHashedToken = await BcryptHelper.hash(tokens.refreshToken);
    await this.authRedisService.updateSession(userPublicId, payloadUUID, {
      ...session,
      refreshToken: newHashedToken,
    });

    const isAgent = 'descId' in payload;

    if (isAgent) {
      await this.authRedisService.refreshPermissions(userPublicId, payloadUUID);
    }

    return tokens;
  }

  private async makeSession(args: MakeSessionArgs): Promise<CreateSessionInput> {
    const { refreshToken, payloadUUID, isOnline, userId, userAgent, fingerprint } = args;
    const hashedRefreshToken = await BcryptHelper.hash(refreshToken);

    return {
      fingerprint,
      hashedRefreshToken,
      isOnline,
      payloadUUID,
      userAgent,
    };
  }

  private mapAgentPayload(
    agent: Agent,
    payloadUUID: PayloadUUID,
    publicDeskId: string,
    teamPublicId?: string,
  ): AgentAuthPayload {
    return {
      deskPublicId: publicDeskId,
      teamPublicId: teamPublicId,
      payloadUUID,
      sub: agent.publicId,
    };
  }

  private mapCustomerPayload(
    customer: FullCustomer,
    payloadUUID: PayloadUUID,
  ): CustomerAuthPayload {
    return {
      payloadUUID,
      sub: customer.publicId,
    };
  }
}
