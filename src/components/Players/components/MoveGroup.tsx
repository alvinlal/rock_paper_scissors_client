import Move from './Move';
import rock from '../../../assets/images/rock.png';
import paper from '../../../assets/images/paper.png';
import scissors from '../../../assets/images/scissors.png';
import { Moves } from '../../../types/Moves';
import { useCallback } from 'react';

interface IMoveGroup {
  move: Moves | null;
  isOpponentGroup: boolean;
}

const MoveGroup: React.FC<IMoveGroup> = ({ move, isOpponentGroup }) => {
  const showMoves = useCallback(() => {
    // css positions
    switch (move) {
      case 'r': {
        return <Move imageUrl={rock} move={'r'} isOpponentMove={isOpponentGroup} />;
      }
      case 'p': {
        return <Move imageUrl={paper} move={'p'} isOpponentMove={isOpponentGroup} />;
      }
      case 's': {
        return <Move imageUrl={scissors} move={'s'} isOpponentMove={isOpponentGroup} />;
      }
      case null: {
        return (
          <>
            <Move imageUrl={rock} move={'r'} isOpponentMove={isOpponentGroup} />
            <Move imageUrl={paper} move={'p'} isOpponentMove={isOpponentGroup} />
            <Move imageUrl={scissors} move={'s'} isOpponentMove={isOpponentGroup} />
          </>
        );
      }
    }
  }, [move, isOpponentGroup]);

  return showMoves();
};

export default MoveGroup;
