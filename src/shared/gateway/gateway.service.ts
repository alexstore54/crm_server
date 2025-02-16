import { Injectable } from '@nestjs/common';
import { Socket } from 'socket.io';
import { GatewayClientsService } from './gateway-clients.service';
import { SocketNamespaces, SocketRooms } from '@/shared/types/socket';

@Injectable()
export class GatewayService {
  constructor(protected readonly clientsService: GatewayClientsService) {
  }

  handleConnection(client: Socket, namespace: SocketNamespaces) {
    const sessionId = client.handshake.auth?.access_token || client.handshake.headers['session-id'];

    if (!sessionId) {
      client.disconnect();
      return;
    }

    this.clientsService.addClient(sessionId, client);
  }

  handleDisconnect(client: Socket, namespace: SocketNamespaces) {
    const sessionId = client.handshake.auth?.sessionId || client.handshake.headers['session-id'];
    if (sessionId) {
      this.clientsService.removeClient(sessionId);
    }
  }

  joinRoom(client: Socket, room: string) {
    const sessionId = client.handshake.auth?.sessionId;
    if (sessionId) {
      this.clientsService.joinRoom(sessionId, room);
      client.join(room);
      console.log(`➕ Клиент ${sessionId} вошел в комнату ${room}`);
    }
  }

  leaveRoom(client: Socket, room: string) {
    const sessionId = client.handshake.auth?.sessionId;
    if (sessionId) {
      this.clientsService.leaveRoom(sessionId, room);
      client.leave(room);
    }
  }

  sendMessageToRoom(server: any, room: SocketRooms, event: string, message: any) {
    this.clientsService.sendMessageToRoom(server, room, event, message);
  }
}
