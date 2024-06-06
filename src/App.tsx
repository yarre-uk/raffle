import { useAccount } from 'wagmi';

import { Card } from './components';
import { Play, Profile } from './features';

const App = () => {
  const { isConnected } = useAccount();

  // const { data: pool } = useReadContract({
  //   abi,
  //   address: proxyAddress,
  //   functionName: 'pool',
  // });

  return (
    <div className="flex h-screen w-screen items-center justify-center">
      <Card className="flex min-h-[80%] w-[80%] flex-col items-center justify-center gap-12 p-8">
        <Profile />
        {isConnected && <Play />}
      </Card>
    </div>
  );
};

export default App;
