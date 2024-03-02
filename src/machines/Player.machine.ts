import { assign, createMachine } from 'xstate';
import { gameChannelService } from '../services/GameChannelService/GameChannel.service';
import { MOVE } from '../services/GameChannelService/GameChannel.events';
import { GameResult } from '../types/GameResult';
import { PlayerTypes } from '../types/PlayerTypes';
import { Moves } from '../types/Moves';

interface PlayerMachineContext {
  roundsWon: number;
  currentMove: Moves | null;
  playerId: string | null;
  playerType: PlayerTypes;
  roundResult: GameResult | null;
}

type PlayerMachineEvents =
  | { type: 'MAKE_MOVE'; move: Moves }
  | { type: 'GAME_ROUND_RESULT'; won: number; result: GameResult }
  | { type: 'RESET' };

type PlayerMachineTypeState =
  | {
      value: 'making_move';
      context: PlayerMachineContext;
    }
  | {
      value: 'made_move';
      context: PlayerMachineContext;
    }
  | { value: 'showing_round_result'; context: PlayerMachineContext };

export const getPlayerMachine = (playerType: PlayerTypes, playerId: string | null = null) => {
  return createMachine<PlayerMachineContext, PlayerMachineEvents, PlayerMachineTypeState>(
    {
      predictableActionArguments: true,
      id: 'playerMachine',
      initial: 'making_move',
      context: {
        playerType,
        playerId,
        currentMove: null,
        roundsWon: 0,
        roundResult: null,
      },
      on: {
        RESET: {
          target: 'making_move',
          actions: ['resetContext'],
        },
      },
      states: {
        making_move: {
          on: {
            MAKE_MOVE: {
              target: 'made_move',
              actions: ['setCurrentMove', 'emitMove'],
            },
            GAME_ROUND_RESULT: {
              target: 'showing_round_result',
              actions: assign({
                roundsWon: (ctx, event) => ctx.roundsWon + event.won,
                roundResult: (_, event) => event.result,
              }),
            },
          },
        },
        made_move: {
          on: {
            GAME_ROUND_RESULT: {
              target: 'showing_round_result',
              actions: assign({
                roundsWon: (ctx, event) => ctx.roundsWon + event.won,
                roundResult: (_, event) => event.result,
              }),
            },
          },
        },
        showing_round_result: {
          after: {
            2000: {
              target: 'making_move',
            },
          },
        },
      },
    },
    {
      actions: {
        setCurrentMove: assign({
          currentMove: (_, event: { type: 'MAKE_MOVE'; move: Moves }) => event.move,
        }),
        emitMove: (ctx, event: { type: 'MAKE_MOVE'; move: Moves }) => {
          if (ctx.playerType == 'own') {
            gameChannelService.emitEvent(MOVE, { player_id: ctx.playerId!, move: event.move });
          }
        },
        resetContext: assign({
          playerType,
          playerId,
          currentMove: null,
          roundsWon: 0,
          roundResult: null,
        }),
      },
    }
  );
};
