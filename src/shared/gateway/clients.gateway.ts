import { OnGatewayConnection, OnGatewayDisconnect, WebSocketGateway } from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { GatewayService } from '@/shared/gateway/gateway.service';
import { SessionsService } from '@/shared/services/redis/sessions/sessions.service';
import { ERROR_MESSAGES } from '@/shared/constants/errors';
import { CookiesUtil } from '@/shared/utils';
import { JwtService } from '@nestjs/jwt';
import { AgentAuthPayload } from '@/shared/types/auth';
import { UnauthorizedException } from '@nestjs/common';
import { Session, SessionId } from '@/shared/types/redis';

@WebSocketGateway({ cors: true })
export class ClientsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(
    private readonly gatewayService: GatewayService,
    private readonly sessionsService: SessionsService,
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

    client.data.sessionId = payloadUUID;
    client.data.userId = sub;

    this.gatewayService.addClient(payloadUUID, client);
    await this.updateUserOnlineStatus(sub, payloadUUID, true);
  }

  public async connect(userId: string, sessionId: SessionId, client: Socket) {
    client.data.sessionId = sessionId;
    client.data.userId = userId;

    this.gatewayService.addClient(sessionId, client);
  }

  async handleDisconnect(client: Socket) {
    const { sessionId, userId } = client.data;
    this.gatewayService.removeClient(sessionId);
    await this.updateUserOnlineStatus(userId, sessionId, false);
  }

  private async updateUserOnlineStatus(userId: string, sessionId: SessionId, isOnline: boolean) {
    const session = await this.sessionsService.getUserSessionBySessionId(sessionId);
    if (!session) throw new UnauthorizedException(ERROR_MESSAGES.SESSION_NOT_FOUND);

    const updatedSession: Session = {
      ...session,
      isOnline,
    };
    await this.sessionsService.updateUserSession(userId, session.payloadUUID, updatedSession);
  }
}
