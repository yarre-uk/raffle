import { useAccount } from 'wagmi';

import { Account } from './account';
import { WalletOptions } from './wallet-options';

const Profile = () => {
  const { isConnected } = useAccount();

  return <div>{isConnected ? <Account /> : <WalletOptions />}</div>;
};

export default Profile;
