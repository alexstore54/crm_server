import { SocketNamespaces } from '@/shared/types/socket';
import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';
import { AuthRedisService } from '@/shared/services/redis/auth-redis';
import { GatewayService } from '@/shared/gateway';

@WebSocketGateway({ nameSpace: SocketNamespaces })
export class SocketGateway {
  @WebSocketServer()
  server: Server;

  constructor(
    private readonly authRedisService: AuthRedisService,
    private readonly gatewayService: GatewayService,
  ) {}

  public async updatePermissionsMessage(userPublicId: string) {

  }

  public async updatePermissionsToAll(usersPublicIds: string[]) {}
}
