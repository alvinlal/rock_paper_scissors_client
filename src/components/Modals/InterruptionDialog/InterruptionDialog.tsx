import { useContext, useCallback } from 'react';
import { MachineContext } from '../../../contexts/Machine.context';
import { InterruptionReason } from '../../../machines/Game.machine';

interface IInterruptionDialog {
  reason: InterruptionReason;
}

const InterruptionDialog: React.FC<IInterruptionDialog> = ({ reason }) => {
  const machines = useContext(MachineContext);

  const handleClick = useCallback(() => {
    machines.ownPlayerMachine.send('RESET');
    machines.opponentPlayerMachine.send('RESET');
    machines.gameMachine.send('MATCH_MAKE');
  }, [machines.gameMachine, machines.opponentPlayerMachine, machines.ownPlayerMachine]);

  const getInterruptionText = useCallback(() => {
    if (reason == 'MOVE_TIMEOUT') {
      return 'Either you or the opponent failed to make a move within a minute !';
    } else if (reason == 'NETWORK_ERROR') {
      return 'Something went wrong with your internet connection, try again later !';
    } else if (reason == 'OPPONENT_JOIN_TIMEOUT') {
      return 'Opponent failed to join !';
    } else if (reason == 'OPPONENT_LEFT') {
      return 'Opponent left the game !';
    }
  }, [reason]);
  return (
    <>
      <div className='text-white font-bold text-5xl mt-[100px]'>UH OH 😔</div>
      <div className='text-white font-semibold text-2xl mt-[100px]'>{getInterruptionText()}</div>
      <button
        onClick={handleClick}
        className='text-white border-2 border-white p-4 rounded-sm mt-[100px] hover:scale-110 transition ease-in-out delay-100 '
      >
        &larr; GO BACK TO LOBBY
      </button>
    </>
  );
};

export default InterruptionDialog;
