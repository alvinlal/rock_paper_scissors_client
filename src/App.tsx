import { MachineContextProvider } from './contexts/Machine.context';
import Game from './pages/Game/Game';
// import { inspect } from '@xstate/inspect';

if (import.meta.env.DEV) {
  // inspect({
  //   iframe: false,
  // });
}

function App() {
  return (
    <MachineContextProvider>
      <Game />
    </MachineContextProvider>
  );
}

export default App;
