import { OnGatewayConnection, OnGatewayDisconnect, WebSocketGateway } from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { GatewayService } from '@/shared/gateway/gateway.service';
import { ERROR_MESSAGES } from '@/shared/constants/errors';
import { CookiesUtil } from '@/shared/utils';
import { JwtService } from '@nestjs/jwt';
import { AgentAuthPayload } from '@/shared/types/auth';
import { UnauthorizedException } from '@nestjs/common';
import { PayloadId, Session } from '@/shared/types/redis';
import { AuthRedisService } from '@/shared/services/redis/auth-redis';

@WebSocketGateway({ cors: true })
export class ClientsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(
    private readonly gatewayService: GatewayService,
    private readonly authRedisService: AuthRedisService,
    private readonly jwtService: JwtService,
  ) {}

  async handleConnection(client: Socket) {
    const cookies = client.handshake.headers.cookie;
    if (!cookies) throw new Error(ERROR_MESSAGES.COOKIES_NOT_FOUND);

    const accessToken = CookiesUtil.getAccessTokenFromCookiesString(cookies);
    if (!accessToken) throw new UnauthorizedException(ERROR_MESSAGES.ACCESS_TOKEN_NOT_FOUND);

    const payload = this.jwtService.verify<AgentAuthPayload>(accessToken);
    if (!payload) throw new UnauthorizedException(ERROR_MESSAGES.SESSION_NOT_FOUND);
    const { sub, payloadUUID } = payload;

    client.data.payloadId = payloadUUID;
    client.data.userId = sub;

    this.gatewayService.addClient(payloadUUID, client);
    await this.updateUserOnlineStatus(sub, payloadUUID, true);
  }

  public async connect(userPublicId: string, payloadId: PayloadId, client: Socket) {
    client.data.payloadId = payloadId;
    client.data.userId = userPublicId;

    this.gatewayService.addClient(payloadId, client);
  }

  async handleDisconnect(client: Socket) {
    const { payloadId, userId } = client.data;
    this.gatewayService.removeClient(payloadId);
    await this.updateUserOnlineStatus(userId, payloadId, false);
  }

  private async updateUserOnlineStatus(
    userPublicId: string,
    payloadId: PayloadId,
    isOnline: boolean,
  ) {
    const session = await this.authRedisService.getOneSession(userPublicId, payloadId);
    if (!session) throw new UnauthorizedException(ERROR_MESSAGES.SESSION_NOT_FOUND);

    const updatedSession: Session = {
      ...session,
      isOnline,
    };
    await this.authRedisService.updateSession(userPublicId, session.payloadUUID, updatedSession);
  }
}
