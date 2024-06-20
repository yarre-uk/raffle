import { useAccount, useDisconnect } from 'wagmi';

import { Button } from '@/components/button';

export const Account = () => {
  const { address } = useAccount();
  const { disconnect } = useDisconnect();

  return (
    <div className="flex flex-row items-center justify-center gap-4">
      {address && <p>Connected</p>}
      <Button onClick={() => disconnect()}>Disconnect</Button>
    </div>
  );
};
