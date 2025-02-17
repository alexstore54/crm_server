import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { SocketNamespaces } from '@/shared/types/socket';
import { SessionsService } from '@/shared/services/sessions/sessions.service';
import { GatewayService } from '@/shared/gateway';
import { Server } from 'socket.io';
import { SessionUUID } from '@/shared/types/auth';
import { ConfigService } from '@nestjs/config';

@WebSocketGateway({ namespace: SocketNamespaces.auth })
export class AuthGateway {
  @WebSocketServer()
  server: Server;

  constructor(
    private readonly sessionsService: SessionsService,
    private readonly gatewayService: GatewayService,
  ) {}

  public async logoutUser(userPublicId: string, sessionUUID: SessionUUID) {
    this.server.to(sessionUUID).emit('logout');
    await this.sessionsService.deleteUserSession(userPublicId, sessionUUID);
    this.gatewayService.removeClient(sessionUUID);
  }

  public async logoutFromAllDevices(userPublicId: string) {
    const sessions = await this.sessionsService.getAllUserSessions(userPublicId);
    sessions.forEach((session) => {
      this.server.to(session.sessionUUID).emit('logout');
      this.gatewayService.removeClient(session.sessionUUID);
    });
    await this.sessionsService.deleteAllUserSessions(userPublicId);
  }

  public async logoutFromAllDevicesExceptCurrent(userPublicId: string, sessionUUID: SessionUUID) {
    await this.sessionsService.deleteAllUserSessionsExceptCurrent(userPublicId, sessionUUID);
  }
}