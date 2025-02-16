import { WebSocketGateway } from '@nestjs/websockets';
import { SocketNamespaces } from '@/shared/types/socket';
import { GatewayClientsService, GatewayService } from '@/shared/gateway';

@WebSocketGateway({ namespace: SocketNamespaces.auth })
export class AuthGateway {
  constructor(private readonly gatewayService: GatewayService) {
  }

  handleConnection(client: any) {
    this.gatewayService.handleConnection(client, SocketNamespaces.auth);
  }


}