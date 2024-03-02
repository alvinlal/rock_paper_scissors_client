import { createContext, useCallback, useEffect } from 'react';
import { InterpreterFrom } from 'xstate';
import { gameMachine } from '../machines/Game.machine';
import { useInterpret } from '@xstate/react';
import {
  GAME_NOT_FOUND,
  GAME_MATCH_RESULT,
  GAME_MATCH_RESULT_PAYLOAD,
  OPPONENT_LEFT,
  OPPONENT_JOIN_TIMEOUT,
  MOVE_TIMEOUT,
  GAME_ROUND_RESULT,
  GAME_ROUND_RESULT_PAYLOAD,
  OPPONENT_MADE_MOVE,
} from '../services/GameChannelService/GameChannel.events';
import {
  NO_PLAYERS,
  GOT_OPPONENT,
  GOT_OPPONENT_PAYLOAD,
} from '../services/LobbyChannelService/LobbyChannel.events';
import { emitter } from '../shared/EventEmitter/EventEmitter';
import { getPlayerMachine } from '../machines/Player.machine';
import { GameResult } from '../types/GameResult';

export const MachineContext = createContext({
  gameMachine: {} as InterpreterFrom<typeof gameMachine>,
  ownPlayerMachine: {} as InterpreterFrom<ReturnType<typeof getPlayerMachine>>,
  opponentPlayerMachine: {} as InterpreterFrom<ReturnType<typeof getPlayerMachine>>,
});

export const MachineContextProvider: React.FC<{ children: React.ReactNode }> = props => {
  const gameMachineService = useInterpret(gameMachine);
  const ownPlayerMachineService = useInterpret(
    getPlayerMachine('own', sessionStorage.getItem('playerId'))
  );
  const opponentPlayerMachineService = useInterpret(getPlayerMachine('opponent'));

  const getOpponentRoundResult = useCallback((ownPlayerRoundResult: GameResult) => {
    if (ownPlayerRoundResult == 'win') return 'loose';
    if (ownPlayerRoundResult == 'loose') return 'win';
    return 'draw';
  }, []);

  // game events
  useEffect(() => {
    emitter.addListener(NO_PLAYERS, () => {
      console.log('got no_players');
      gameMachineService.send('NO_PLAYERS');
    });

    emitter.addListener(GOT_OPPONENT, (payload: GOT_OPPONENT_PAYLOAD) => {
      gameMachineService.send({ type: 'GOT_OPPONENT', gameChannelId: payload.game_channel_id });
    });

    emitter.addListener(GAME_NOT_FOUND, () => {
      gameMachineService.send('NETWORK_ERROR');
    });

    emitter.addListener(GAME_MATCH_RESULT, (payload: GAME_MATCH_RESULT_PAYLOAD) => {
      ownPlayerMachineService.send({
        type: 'GAME_ROUND_RESULT',
        won: payload.result == 'win' ? 1 : 0,
        result: payload.result,
      });
      opponentPlayerMachineService.send({
        type: 'GAME_ROUND_RESULT',
        won: payload.result == 'win' || payload.result == 'draw' ? 0 : 1,
        result: getOpponentRoundResult(payload.result),
      });
      gameMachineService.send({ type: 'GAME_MATCH_RESULT', result: payload.result });
    });

    emitter.addListener(OPPONENT_LEFT, () => {
      gameMachineService.send('OPPONENT_LEFT');
    });

    emitter.addListener(OPPONENT_JOIN_TIMEOUT, () => {
      gameMachineService.send('OPPONENT_JOIN_TIMEOUT');
    });

    emitter.addListener(MOVE_TIMEOUT, () => {
      gameMachineService.send('MOVE_TIMEOUT');
    });
  }, [
    gameMachineService,
    getOpponentRoundResult,
    ownPlayerMachineService,
    opponentPlayerMachineService,
  ]);

  // player events
  useEffect(() => {
    emitter.addListener(OPPONENT_MADE_MOVE, () => {
      opponentPlayerMachineService.send('MAKE_MOVE');
    });

    emitter.addListener(GAME_ROUND_RESULT, (payload: GAME_ROUND_RESULT_PAYLOAD) => {
      ownPlayerMachineService.send({
        type: 'GAME_ROUND_RESULT',
        won: payload.result == 'win' ? 1 : 0,
        result: payload.result,
      });
      opponentPlayerMachineService.send({
        type: 'GAME_ROUND_RESULT',
        won: payload.result == 'win' || payload.result == 'draw' ? 0 : 1,
        result: getOpponentRoundResult(payload.result),
      });
    });
  }, [opponentPlayerMachineService, ownPlayerMachineService, getOpponentRoundResult]);

  return (
    <MachineContext.Provider
      value={{
        gameMachine: gameMachineService,
        ownPlayerMachine: ownPlayerMachineService,
        opponentPlayerMachine: opponentPlayerMachineService,
      }}
    >
      {props.children}
    </MachineContext.Provider>
  );
};
