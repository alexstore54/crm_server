import { WebSocketGateway } from '@nestjs/websockets';
import { BaseGateway } from '@/shared/gateway';
import { SocketNamespaces } from '@/shared/types/socket';

@WebSocketGateway({ namespace: SocketNamespaces.auth })
export class AuthGateway extends BaseGateway {

}