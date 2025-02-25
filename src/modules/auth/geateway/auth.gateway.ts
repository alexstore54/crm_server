import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { SocketNamespaces } from '@/shared/types/socket';
import { SessionsService } from '@/shared/services/redis/sessions/sessions.service';
import { GatewayService } from '@/shared/gateway';
import { Server } from 'socket.io';
import { PayloadUUID } from '@/shared/types/redis';

@WebSocketGateway({ namespace: SocketNamespaces.auth })
export class AuthGateway {
  @WebSocketServer()
  server: Server;

  constructor(
    private readonly sessionsService: SessionsService,
    private readonly gatewayService: GatewayService,
  ) {}

  public async logoutUser(userPublicId: string, payloadUUID: PayloadUUID) {
    this.server.to(payloadUUID).emit('logout');
    await this.sessionsService.deleteUserSession(userPublicId, payloadUUID);
    this.gatewayService.removeClient(payloadUUID);
  }

  public async logoutFromAllDevices(userPublicId: string) {
    const sessions = await this.sessionsService.getAllUserSessions(userPublicId);
    sessions.forEach((session) => {
      this.server.to(session.payloadUUID).emit('logout');
      this.gatewayService.removeClient(session.payloadUUID);
    });
    await this.sessionsService.deleteAllUserSessions(userPublicId);
  }

  public async logoutFromAllDevicesExceptCurrent(userPublicId: string, payloadUUID: PayloadUUID) {
    const sessions = await this.sessionsService.getAllUserSessions(userPublicId);
    sessions.forEach((session) => {
      if (session.payloadUUID !== payloadUUID) {
        this.server.to(session.payloadUUID).emit('logout');
        this.gatewayService.removeClient(session.payloadUUID);
      }
    });
    await this.sessionsService.deleteAllUserSessionsExceptCurrent(userPublicId, payloadUUID);
  }
}
