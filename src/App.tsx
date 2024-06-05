import { useReadContract } from 'wagmi';

import { abi, proxyAddress } from './constants';
import { Profile } from './features';

const App = () => {
  const { data: pool } = useReadContract({
    abi,
    address: proxyAddress,
    functionName: 'pool',
  });

  const { data: vrfCoordinator } = useReadContract({
    abi,
    address: proxyAddress,
    functionName: 's_vrfCoordinator',
  });

  return (
    <div className="h-screen w-screen p-1">
      <Profile />
      <p className="text-3xl">pool: {pool?.toString()}</p>
      <p>vrfCoordinator: {vrfCoordinator}</p>
    </div>
  );
};

export default App;
