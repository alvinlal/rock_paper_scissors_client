import { useCallback, useContext } from 'react';

import { MachineContext } from '../../../contexts/Machine.context';
import { GameResult } from '../../../types/GameResult';
import { useSelector } from '@xstate/react';

interface IGameResultDialog {
  result: GameResult;
}

const GameResultDialog: React.FC<IGameResultDialog> = ({ result }) => {
  const machines = useContext(MachineContext);
  const ownPlayerScore = useSelector(machines.ownPlayerMachine, state => state.context.roundsWon);
  const opponentPlayerScore = useSelector(
    machines.opponentPlayerMachine,
    state => state.context.roundsWon
  );

  const handleClick = useCallback(() => {
    machines.ownPlayerMachine.send('RESET');
    machines.opponentPlayerMachine.send('RESET');
    machines.gameMachine.send('MATCH_MAKE');
  }, [machines.gameMachine, machines.opponentPlayerMachine, machines.ownPlayerMachine]);

  return (
    <>
      <div className='text-white font-bold text-5xl mt-[100px]'>YOU {result.toUpperCase()} !</div>
      <div className='text-white font-semibold text-5xl mt-[50px]'>
        {ownPlayerScore} : {opponentPlayerScore}
      </div>
      <button
        onClick={handleClick}
        className='text-white border-2 border-white p-4 rounded-sm mt-[100px] hover:scale-110 transition ease-in-out delay-100 '
      >
        &larr; GO BACK TO LOBBY
      </button>
    </>
  );
};

export default GameResultDialog;
