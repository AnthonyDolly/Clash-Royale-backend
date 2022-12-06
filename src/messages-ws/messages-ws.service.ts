import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Socket } from 'socket.io';
import { User } from './../users/entities/user.entity';

interface ConnectedClient {
  [id: string]: {
    socket: Socket;
    user: User;
  };
}

@Injectable()
export class MessagesWsService {
  private connectedClients: ConnectedClient = {};

  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}

  async registerClient(client: Socket, userId: string) {
    const user = await this.userModel.findById(userId);

    if (!user) throw new Error('User not found');

    this.checkUserConnection(user);

    this.connectedClients[client.id] = {
      socket: client,
      user,
    };
  }

  removeClient(clientId: string) {
    delete this.connectedClients[clientId];
  }

  getConnectedClients(): string[] {
    return Object.keys(this.connectedClients);
  }

  getUserFullNameBySocketId(socketId: string): string {
    return this.connectedClients[socketId].user.name;
  }

  private checkUserConnection(user: User) {
    for (const clientId of Object.keys(this.connectedClients)) {
      const connectedClients = this.connectedClients[clientId];
      if (connectedClients.user.id === user.id) {
        connectedClients.socket.disconnect();
        break;
      }
    }
  }
}
