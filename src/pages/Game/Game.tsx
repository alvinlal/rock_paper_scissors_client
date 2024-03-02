import { useCallback, useContext } from 'react';
import Players from '../../components/Players/Players';
import InterruptionDialog from '../../components/Modals/InterruptionDialog/InterruptionDialog';
import GameResultDialog from '../../components/Modals/GameResultDialog/GameResultDialog';
import { MachineContext } from '../../contexts/Machine.context';
import { useSelector } from '@xstate/react';
import LobbyMessage from '../../components/LobbyMessage/LobbyMessage';

const Game: React.FC = () => {
  const machines = useContext(MachineContext);
  const gameState = useSelector(machines.gameMachine, state => state);

  console.log(gameState.value);

  const renderGame = useCallback(() => {
    if (gameState.matches('match_making')) {
      return <LobbyMessage message={gameState.context.lobbyMessage} />;
    } else if (gameState.matches('playing')) {
      return <Players />;
    } else if (gameState.matches('game_interrupted')) {
      return <InterruptionDialog reason={gameState.context.interruptionReason} />;
    } else if (gameState.matches('showing_game_result')) {
      return <GameResultDialog result={gameState.context.gameResult} />;
    }
  }, [gameState]);

  return (
    <div className='h-[100vh] w-full flex flex-col items-center'>
      <h1 className='text-white text-[54px] font-bold mt-10'>ROCK PAPER SCISSORS</h1>
      {renderGame()}
    </div>
  );
};

export default Game;
