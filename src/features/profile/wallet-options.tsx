import { useConnect } from 'wagmi';

import { Button } from '@/components/button';
import { Card } from '@/components/card';

export const WalletOptions = () => {
  const { connectors, connect } = useConnect();

  return (
    <Card className="flex h-fit w-fit flex-col items-center justify-center gap-4 p-8">
      <h3 className="text-2xl font-semibold leading-none tracking-tight">
        Connect your wallet
      </h3>

      {connectors
        .filter((connector) => !!connector.icon)
        .map((connector) => (
          <Button
            className="flex flex-row items-center justify-center gap-2 p-8"
            key={connector.uid}
            onClick={() => connect({ connector })}
          >
            <img src={connector.icon} />
            {connector.name}
          </Button>
        ))}
    </Card>
  );
};
