import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { SocketNamespaces } from '@/shared/types/socket';
import { SessionsService } from '@/shared/services/sessions/sessions.service';
import { GatewayService } from '@/shared/gateway';
import { Server } from 'socket.io';
import { SessionId } from '@/shared/types/auth';
import { ConfigService } from '@nestjs/config';

@WebSocketGateway({ namespace: SocketNamespaces.auth })
export class AuthGateway {
  @WebSocketServer()
  server: Server;

  constructor(
    private readonly sessionsService: SessionsService,
    private readonly gatewayService: GatewayService,
    private readonly configService: ConfigService,
  ) {
  }

  public connect(sessionId: SessionId) {

  }

  public async logoutUser(sessionId: SessionId) {
    this.server.to(sessionId).emit('logout');
    const session = await this.sessionsService.getUserSessionBySessionId(sessionId);
    if (!session) {
      return;
    }
    await this.sessionsService.deleteUserSession(session.userId, session.sessionUUID);
    this.gatewayService.removeClient(sessionId);
  }

  public async logoutFromAllDevices(userId: string) {
    const sessions = await this.sessionsService.getAllUserSessions(userId);
    sessions.forEach((session) => {
      this.server.to(session.sessionUUID).emit('logout');
      this.gatewayService.removeClient(session.sessionUUID);
    });
    await this.sessionsService.deleteAllUserSessions(userId);
  }

  public async logoutFromAllDevicesExceptCurrent(userId: string, sessionId: SessionId) {
    const currentSession = await this.sessionsService.getUserSessionBySessionId(sessionId);
    if (!currentSession) {
      return;
    }

    const sessions = await this.sessionsService.getAllUserSessions(userId);

    //logout from all devices except current by socket
    sessions.forEach((session) => {
      if (currentSession.sessionUUID !== session.sessionUUID) {
        this.server.to(session.sessionUUID).emit('logout');
        this.gatewayService.removeClient(session.sessionUUID);
      }
    });

    await this.sessionsService.deleteAllUserSessionsExceptCurrent(userId, currentSession.sessionUUID);
  }
}