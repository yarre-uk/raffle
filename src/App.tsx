import { useAccount, useReadContract } from 'wagmi';

import { abi } from './abi';
import { Account } from './account';
import { contractAddresses } from './constants';
import { Initialize } from './initialize';
import { WalletOptions } from './wallet-options';

const ConnectWallet = () => {
  const { isConnected } = useAccount();
  if (isConnected) return <Account />;
  return <WalletOptions />;
};

const App = () => {
  const { data: pool } = useReadContract({
    abi,
    address: contractAddresses,
    functionName: 'pool',
  });

  const { data: vrfCoordinator } = useReadContract({
    abi,
    address: contractAddresses,
    functionName: 's_vrfCoordinator',
  });

  return (
    <div className="text-red p-1">
      <ConnectWallet />
      <Initialize />
      <p>pool: {pool?.toString()}</p>
      <p>vrfCoordinator: {vrfCoordinator}</p>
    </div>
  );
};

export default App;
