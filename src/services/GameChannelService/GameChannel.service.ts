import { Channel } from 'phoenix';
import { socketService } from '../SocketService/Socket.service';
import { emitter } from '../../shared/EventEmitter/EventEmitter';
import { GAME_CHANNEL_EVENTS, OUTGOING_EVENTS } from './GameChannel.events';

export class GameChannelService {
  private gameChannel?: Channel;

  join(gameChannelId: string) {
    const playerId = sessionStorage.getItem('playerId');
    this.gameChannel = socketService.getSocketChannel(`game:${gameChannelId}`, {
      player_id: playerId!,
    });
    this.gameChannel
      .join()
      .receive('ok', () => {
        console.log(`player ${playerId} joined game channel ${gameChannelId}`);
      })
      .receive('error', err => {
        console.log('unable to join game channel', err);
      });

    // Add events
    GAME_CHANNEL_EVENTS.forEach(event => {
      this.gameChannel!.on(event, payload => {
        emitter.emit(event, payload);
      });
    });
  }

  emitEvent(event: OUTGOING_EVENTS, payload: Record<string, string | number>) {
    this.gameChannel?.push(event, payload);
  }

  leave() {
    this.gameChannel?.leave();
  }
}

export const gameChannelService = new GameChannelService();
