import { Injectable } from '@nestjs/common';
import { Socket } from 'socket.io';
import { SocketRooms } from '@/shared/types/socket';
import { PayloadId } from '@/shared/types/redis';

@Injectable()
export class GatewayService {
  private connectedClients = new Map<string, Socket>();
  private rooms = new Map<string, Set<string>>();

  public addClient(payloadId: PayloadId, client: Socket) {
    this.connectedClients.set(payloadId, client);
  }

  public removeClient(payloadId: PayloadId) {
    this.connectedClients.delete(payloadId);
  }

  public getConnectedClients() {
    return this.connectedClients;
  }

  public joinRoom(payloadId: PayloadId, room: string) {
    if (!this.rooms.has(room)) {
      this.rooms.set(room, new Set());
    }
    this.rooms.get(room)?.add(payloadId);
  }

  public leaveRoom(payloadId: PayloadId, room: string) {
    this.rooms.get(room)?.delete(payloadId);
  }

  public sendMessageToRoom(server: any, room: SocketRooms, event: string, message: any) {
    server.to(room).emit(event, message);
  }
}
