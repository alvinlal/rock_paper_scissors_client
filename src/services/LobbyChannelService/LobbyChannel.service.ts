import * as uuid from 'uuid';
import { Channel } from 'phoenix';
import { socketService } from '../SocketService/Socket.service';
import { LOBBY_CHANNEL_EVENTS } from './LobbyChannel.events';
import { emitter } from '../../shared/EventEmitter/EventEmitter';

export class LobbyChannelService {
  public playerId: string;
  private lobbyChannel?: Channel;

  constructor() {
    if (!sessionStorage.getItem('playerId')) {
      this.playerId = uuid.v4();
      sessionStorage.setItem('playerId', this.playerId);
    } else {
      this.playerId = sessionStorage.getItem('playerId')!;
    }
  }
  join() {
    this.lobbyChannel = socketService.getSocketChannel(
      `lobby:player:${this.playerId}:${uuid.v4()}`
    );
    this.lobbyChannel
      .join()
      .receive('ok', () => {
        console.log(`player ${this.playerId} joined lobby channel successfully`);
      })
      .receive('error', err => {
        console.log('unable to join lobby channel', err);
      });

    // Add Events
    LOBBY_CHANNEL_EVENTS.forEach(event => {
      this.lobbyChannel!.on(event, payload => {
        emitter.emit(event, payload);
      });
    });
  }
  leave() {
    this.lobbyChannel?.leave();
  }
}

export const lobbyChannelService = new LobbyChannelService();
