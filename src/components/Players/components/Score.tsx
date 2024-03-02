import { StarIcon } from '@heroicons/react/24/outline';

interface IScoreProps {
  score: number;
}

const Score: React.FC<IScoreProps> = ({ score }) => {
  return (
    <div className='flex'>
      <StarIcon
        height={38}
        width={38}
        className={`text-white ${score >= 1 ? 'fill-white' : 'fill-none'}`}
      />
      <StarIcon
        height={38}
        width={38}
        className={`text-white ${score >= 2 ? 'fill-white' : 'fill-none'}`}
      />
      <StarIcon
        height={38}
        width={38}
        className={`text-white ${score >= 3 ? 'fill-white' : 'fill-none'}`}
      />
    </div>
  );
};

export default Score;
