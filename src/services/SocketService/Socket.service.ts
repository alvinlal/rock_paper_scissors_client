import { Socket } from 'phoenix';

export class SocketService {
  private readonly socket: Socket;
  constructor(endpoint: string) {
    this.socket = new Socket(endpoint);
    this.socket.connect();
  }

  getSocketChannel(topic: string, params: Record<string, string | number> = {}) {
    return this.socket.channel(topic, params);
  }
}

export const socketService = new SocketService(import.meta.env.VITE_WEBSOCKET_ENDPOINT);
