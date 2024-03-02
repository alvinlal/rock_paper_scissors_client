import Score from '../Players/../components/Score';
import MoveGroup from '../../Players/components/MoveGroup';
import { useCallback, useContext } from 'react';
import { MachineContext } from '../../../contexts/Machine.context';
import { useSelector } from '@xstate/react';

const OwnPlayer: React.FC = () => {
  const machines = useContext(MachineContext);
  const ownPlayerState = useSelector(machines.ownPlayerMachine, state => state);

  const renderOwnPlayerState = useCallback(() => {
    if (ownPlayerState.matches('making_move')) {
      return <MoveGroup move={null} isOpponentGroup={false} />;
    } else if (ownPlayerState.matches('made_move')) {
      return <MoveGroup move={ownPlayerState.context.currentMove} isOpponentGroup={false} />;
    }
    return <MoveGroup move={ownPlayerState.context.currentMove} isOpponentGroup={false} />;
  }, [ownPlayerState]);

  return (
    <div className='flex flex-col justify-start items-center w-[400px]'>
      <h1 className='text-white font-medium  text-[32px] mb-4'>YOUR SCORE</h1>
      <Score score={ownPlayerState.context.roundsWon} />
      <div className='flex h-[250px] mt-20'>{renderOwnPlayerState()}</div>
      <h1 className='text-white font-semibold text-2xl'>
        {ownPlayerState.matches('making_move') ? 'Take your pick' : 'You made a pick'}
      </h1>
    </div>
  );
};

export default OwnPlayer;
