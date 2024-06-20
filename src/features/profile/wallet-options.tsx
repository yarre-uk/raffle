import { useConnect } from 'wagmi';

import { Button } from '@/components/button';

export const WalletOptions = () => {
  const { connectors, connect } = useConnect();

  return (
    <div className="flex flex-row items-center justify-center gap-4">
      <p>Connect your wallet</p>

      {connectors
        .filter((connector) => !!connector.icon)
        .map((connector) => (
          <Button
            className="flex flex-row items-center justify-center"
            key={connector.uid}
            onClick={() => connect({ connector })}
          >
            <img src={connector.icon} className="" />
            {connector.name}
          </Button>
        ))}
    </div>
  );
};
