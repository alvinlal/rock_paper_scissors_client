import OwnPlayer from './components/OwnPlayer';
import OpponentPlayer from './components/OpponentPlayer';
import { useSelector } from '@xstate/react';
import { MachineContext } from '../../contexts/Machine.context';
import { useCallback, useContext } from 'react';

const Players: React.FC = () => {
  const machines = useContext(MachineContext);
  const ownPlayerState = useSelector(machines.ownPlayerMachine, state => state);

  const renderRoundResult = useCallback(() => {
    if (ownPlayerState.matches('showing_round_result')) {
      if (ownPlayerState.context.roundResult == 'win') return 'YOU WIN!';
      if (ownPlayerState.context.roundResult == 'loose') return 'YOU LOOSE!';
      return "IT'S A DRAW";
    }
  }, [ownPlayerState]);

  return (
    <div className='flex m-auto justify-between w-[80%] '>
      <OwnPlayer />
      <div className='w-[200px]  text-center text-3xl mt-auto font-bold  text-white'>
        {renderRoundResult()}
      </div>
      <OpponentPlayer />
    </div>
  );
};

export default Players;
