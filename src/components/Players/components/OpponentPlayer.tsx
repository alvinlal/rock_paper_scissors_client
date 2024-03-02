import Score from '../../Players/components/Score';
import MoveGroup from '../../Players/components/MoveGroup';
import Spinner from '../../Players/components/Spinner';
import { useCallback, useContext } from 'react';
import { useSelector } from '@xstate/react';
import { MachineContext } from '../../../contexts/Machine.context';
import { ReactComponent as TickIcon } from '../../../assets/icons/tick.svg';
import { Moves } from '../../../types/Moves';

const looseMatrix: { [k in Moves]: Moves } = {
  r: 's',
  p: 'r',
  s: 'p',
};

const winMatrix: { [k in Moves]: Moves } = {
  p: 's',
  s: 'r',
  r: 'p',
};

const OpponentPlayer: React.FC = () => {
  const machines = useContext(MachineContext);
  const opponentPlayerState = useSelector(machines.opponentPlayerMachine, state => state);
  const ownPlayerState = useSelector(machines.ownPlayerMachine, state => state);

  console.log('opponent player state is ', opponentPlayerState);

  const getOpponentRoundResultMove = useCallback((): Moves => {
    if (ownPlayerState.context.roundResult == 'draw') {
      return ownPlayerState.context.currentMove!;
    }
    if (ownPlayerState.context.roundResult == 'win') {
      return looseMatrix[ownPlayerState.context.currentMove!];
    }
    return winMatrix[ownPlayerState.context.currentMove!];
  }, [ownPlayerState.context.currentMove, ownPlayerState.context.roundResult]);

  const renderOpponentPlayerState = useCallback(() => {
    if (opponentPlayerState.matches('making_move')) {
      return <Spinner height={140} width={140} />;
    } else if (opponentPlayerState.matches('made_move')) {
      return <TickIcon className='h-[120px] w-[120px]' />;
    }

    return <MoveGroup move={getOpponentRoundResultMove()} isOpponentGroup={true} />;
  }, [opponentPlayerState, getOpponentRoundResultMove]);

  return (
    <div className='flex flex-col justify-start items-center w-[400px]'>
      <h1 className='text-white font-medium  text-[32px] mb-4'>OPPONENT'S SCORE</h1>
      <Score score={opponentPlayerState.context.roundsWon} />
      <div className='flex h-[250px] mt-20'>{renderOpponentPlayerState()}</div>
      <h1 className='text-white font-semibold text-2xl'>
        {opponentPlayerState.matches('making_move')
          ? 'Opponent is picking'
          : 'Opponent made a pick'}
      </h1>
    </div>
  );
};

export default OpponentPlayer;
