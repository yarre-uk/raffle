import { useAccount, useDisconnect, useEnsAvatar, useEnsName } from 'wagmi';

import { Button } from '@/components/button';
import { Card } from '@/components/card';

export const Account = () => {
  const { address } = useAccount();
  const { disconnect } = useDisconnect();
  const { data: ensName } = useEnsName({ address });
  const { data: ensAvatar } = useEnsAvatar({ name: ensName! });

  return (
    <Card className="flex h-fit w-fit flex-col items-center justify-center gap-4 p-8">
      {ensAvatar && <img alt="ENS Avatar" src={ensAvatar} />}
      {address && <div>{ensName ? `${ensName} (${address})` : address}</div>}
      <Button onClick={() => disconnect()}>Disconnect</Button>
    </Card>
  );
};
