import { useEffect, useState } from 'react';

interface ILobbyMessageProps {
  message: string;
}

const LobbyMessage: React.FC<ILobbyMessageProps> = ({ message }) => {
  const [loadingDots, setLoadingDots] = useState('');

  useEffect(() => {
    setInterval(() => {
      setLoadingDots(current => (current.length < 4 ? current + '.' : '.'));
    }, 1000);
  }, []);

  return (
    <div className='relative flex items-center m-auto h-[80px]'>
      <span className='text-white text-[32px]'>{message}</span>
      <div className='absolute left-full top-[-20px]'>
        <span className='text-white text-[64px]'> {loadingDots}</span>
      </div>
    </div>
  );
};

export default LobbyMessage;
