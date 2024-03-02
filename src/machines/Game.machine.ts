import { assign, createMachine } from 'xstate';
import { lobbyChannelService } from '../services/LobbyChannelService/LobbyChannel.service';
import { GameResult } from '../types/GameResult';
import { gameChannelService } from '../services/GameChannelService/GameChannel.service';

export type InterruptionReason =
  | 'OPPONENT_LEFT'
  | 'OPPONENT_JOIN_TIMEOUT'
  | 'MOVE_TIMEOUT'
  | 'NETWORK_ERROR';

interface GameMachineContext {
  gameResult?: GameResult;
  lobbyMessage?: string;
  interruptionReason?: InterruptionReason;
}

type GameMachineEvents =
  | { type: 'MATCH_MAKE' }
  | { type: 'NO_PLAYERS' }
  | { type: 'GOT_OPPONENT'; gameChannelId: string }
  | { type: 'MOVE_TIMEOUT' }
  | { type: 'NETWORK_ERROR' }
  | { type: 'OPPONENT_LEFT' }
  | { type: 'GAME_MATCH_RESULT'; result: GameResult }
  | { type: 'OPPONENT_JOIN_TIMEOUT' };

type GameMachineTypeState =
  | {
      value: 'match_making';
      context: GameMachineContext & {
        lobbyMessage: string;
      };
    }
  | {
      value: 'playing';
      context: GameMachineContext;
    }
  | {
      value: 'showing_game_result';
      context: GameMachineContext & {
        gameResult: GameResult;
      };
    }
  | {
      value: 'game_interrupted';
      context: GameMachineContext & {
        interruptionReason: string;
      };
    };

export const gameMachine = createMachine<
  GameMachineContext,
  GameMachineEvents,
  GameMachineTypeState
>(
  {
    predictableActionArguments: true,
    id: 'gameMachine',
    initial: 'match_making',
    context: {
      lobbyMessage: 'Waiting for opponent connection',
    },
    states: {
      match_making: {
        entry: 'joinLobbyChannel',
        on: {
          GOT_OPPONENT: {
            target: 'playing',
            actions: (_, event) => {
              gameChannelService.join(event.gameChannelId);
            },
          },
          NO_PLAYERS: {
            actions: assign({
              lobbyMessage: 'No players found, Please wait on this screen for an opponent to join',
            }),
          },
        },
      },
      playing: {
        entry: 'leaveLobbyChannel',
        on: {
          GAME_MATCH_RESULT: {
            target: 'showing_game_result',
            actions: assign({
              gameResult: (_, event) => event.result,
            }),
          },
          OPPONENT_LEFT: {
            target: 'game_interrupted',
            actions: assign({
              interruptionReason: (_, event) => event.type,
            }),
          },
          OPPONENT_JOIN_TIMEOUT: {
            target: 'game_interrupted',
            actions: assign({
              interruptionReason: (_, event) => event.type,
            }),
          },
          MOVE_TIMEOUT: {
            target: 'game_interrupted',
            actions: assign({
              interruptionReason: (_, event) => event.type,
            }),
          },
          NETWORK_ERROR: {
            target: 'game_interrupted',
            actions: assign({
              interruptionReason: (_, event) => event.type,
            }),
          },
        },
      },
      showing_game_result: {
        on: {
          MATCH_MAKE: {
            target: 'match_making',
            actions: assign({
              lobbyMessage: 'Waiting for opponent connection...',
            }),
          },
        },
      },
      game_interrupted: {
        on: {
          MATCH_MAKE: {
            target: 'match_making',
            actions: assign({
              lobbyMessage: 'Waiting for opponent connection...',
            }),
          },
        },
      },
    },
  },
  {
    actions: {
      joinLobbyChannel: () => {
        lobbyChannelService.join();
      },
      leaveLobbyChannel: () => {
        lobbyChannelService.leave();
      },
    },
  }
);
