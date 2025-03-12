import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { SocketNamespaces } from '@/shared/types/socket';
import { GatewayService } from '@/shared/gateway';
import { Server } from 'socket.io';
import { PayloadUUID } from '@/shared/types/redis';
import { AuthRedisService } from '@/shared/services/redis/auth-redis';

@WebSocketGateway({ namespace: SocketNamespaces.auth })
export class AuthGateway {
  @WebSocketServer()
  server: Server;

  constructor(
    private readonly authRedisService: AuthRedisService,
    private readonly gatewayService: GatewayService,
  ) {}

  public async logoutUser(userPublicId: string, payloadUUID: PayloadUUID) {
    this.server.to(payloadUUID).emit('logout');
    await this.authRedisService.deleteOneSession(userPublicId, payloadUUID);
    this.gatewayService.removeClient(payloadUUID);
  }

  public async logoutFromAllDevices(userPublicId: string) {
    const sessions = await this.authRedisService.getAllSessionsByUserId(userPublicId);
    sessions.forEach((session) => {
      this.server.to(session.payloadUUID).emit('logout');
      this.gatewayService.removeClient(session.payloadUUID);
    });
    const permissions = await this.authRedisService.getOnePermissions(
      userPublicId,
      sessions[0].payloadUUID,
    );

    if (permissions) {
      await this.authRedisService.deletePermissions(userPublicId, sessions[0].payloadUUID);
    }

    await this.authRedisService.deleteAllSessionsByUserPublicId(userPublicId);
  }

  public async logoutFromAllDevicesExceptCurrent(userPublicId: string, payloadUUID: PayloadUUID) {
    const sessions = await this.authRedisService.getAllSessionsByUserId(userPublicId);
    sessions.forEach((session) => {
      if (session.payloadUUID !== payloadUUID) {
        this.server.to(session.payloadUUID).emit('logout');
        this.gatewayService.removeClient(session.payloadUUID);
      }
    });
    await this.authRedisService.deleteAllUserSessionsExceptCurrent(userPublicId, payloadUUID);
  }
}
