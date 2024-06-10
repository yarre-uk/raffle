import { useAccount } from 'wagmi';

import { Card } from './components';
import { GameInfo, Play, Profile } from './features';

const App = () => {
  const { isConnected } = useAccount();

  return (
    <div className="max-w-screen flex min-h-screen flex-col items-center justify-center gap-4 py-4">
      <Card className="flex min-h-[60%] w-[80%] flex-col items-center justify-center gap-12 p-8">
        <Profile />
        {isConnected && (
          <>
            <Play />
          </>
        )}
      </Card>
      {isConnected && <GameInfo />}
    </div>
  );
};

export default App;
