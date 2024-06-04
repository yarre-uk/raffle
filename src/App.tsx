import { useAccount } from 'wagmi';

import { Account } from './account';
import { WalletOptions } from './wallet-options';

const ConnectWallet = () => {
  const { isConnected } = useAccount();
  if (isConnected) return <Account />;
  return <WalletOptions />;
};

const App = () => {
  return (
    <div className="text-red p-1">
      <ConnectWallet />
      <p className="text-red-500">asdasd</p>
    </div>
  );
};

export default App;
