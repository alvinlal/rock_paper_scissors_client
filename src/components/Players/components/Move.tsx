import { useCallback, useContext } from 'react';
import { MachineContext } from '../../../contexts/Machine.context';
import { Moves } from '../../../types/Moves';

interface IMoveProps {
  imageUrl: string;
  move: Moves;
  isOpponentMove: boolean;
}

const Move: React.FC<IMoveProps> = ({ imageUrl, isOpponentMove, move }) => {
  const machines = useContext(MachineContext);

  const handleClick = useCallback(() => {
    if (!isOpponentMove) {
      machines.ownPlayerMachine.send({ type: 'MAKE_MOVE', move });
    }
  }, [machines, move, isOpponentMove]);

  const getAlt = useCallback(() => {
    if (move == 'r') return 'rock';
    if (move == 'p') return 'paper';
    if (move == 's') return 'scissors';
  }, [move]);

  return (
    <div
      className={`inline-block border-4 border-solid border-white p-5 ml-4 mr-4 transition-all ease-in rounded-[50%] h-32 w-32 ${
        !isOpponentMove ? 'hover:cursor-pointer hover:bg-[#676a72] hover:scale-105' : ''
      }`}
      onClick={handleClick}
    >
      <img src={imageUrl} alt={getAlt()} className='h-full w-full' />
    </div>
  );
};

export default Move;
