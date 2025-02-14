import { Injectable } from '@nestjs/common';
import { Socket } from 'socket.io';
import { GatewayService } from './gateway.service';
import { SocketNamespaces, SocketRooms } from '@/shared/types/socket';

@Injectable()
export class BaseGateway {
  constructor(protected readonly gatewayService: GatewayService) {
  }

  handleConnection(client: Socket, namespace: SocketNamespaces) {
    const sessionId = client.handshake.auth?.access_token || client.handshake.headers['session-id'];

    if (!sessionId) {
      client.disconnect();
      return;
    }

    this.gatewayService.addClient(sessionId, client);
  }

  handleDisconnect(client: Socket, namespace: SocketNamespaces) {
    const sessionId = client.handshake.auth?.sessionId || client.handshake.headers['session-id'];
    if (sessionId) {
      this.gatewayService.removeClient(sessionId);
    }
  }

  joinRoom(client: Socket, room: string) {
    const sessionId = client.handshake.auth?.sessionId;
    if (sessionId) {
      this.gatewayService.joinRoom(sessionId, room);
      client.join(room);
      console.log(`➕ Клиент ${sessionId} вошел в комнату ${room}`);
    }
  }

  leaveRoom(client: Socket, room: string) {
    const sessionId = client.handshake.auth?.sessionId;
    if (sessionId) {
      this.gatewayService.leaveRoom(sessionId, room);
      client.leave(room);
    }
  }

  sendMessageToRoom(server: any, room: SocketRooms, event: string, message: any) {
    this.gatewayService.sendMessageToRoom(server, room, event, message);
  }
}
