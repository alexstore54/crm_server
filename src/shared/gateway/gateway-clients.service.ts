import { Injectable } from '@nestjs/common';
import { Socket } from 'socket.io';
import { SessionId } from '@/shared/types/auth';
import { SocketRooms } from '@/shared/types/socket';

@Injectable()
export class GatewayClientsService {
  private connectedClients = new Map<string, Socket>();
  private rooms = new Map<string, Set<string>>();

  public addClient(sessionId: SessionId, client: Socket) {
    this.connectedClients.set(sessionId, client);
  }

  public removeClient(sessionId: SessionId) {
    this.connectedClients.delete(sessionId);
  }

  public getConnectedClients() {
    return this.connectedClients;
  }

  public joinRoom(sessionId: SessionId, room: string) {
    if (!this.rooms.has(room)) {
      this.rooms.set(room, new Set());
    }
    this.rooms.get(room)?.add(sessionId);
  }

  public leaveRoom(sessionId: SessionId, room: string) {
    this.rooms.get(room)?.delete(sessionId);
  }

  public sendMessageToRoom(server: any, room: SocketRooms, event: string, message: any) {
    server.to(room).emit(event, message);
  }
}
