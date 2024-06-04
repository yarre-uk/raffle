import { useConnect } from 'wagmi';

export const WalletOptions = () => {
  const { connectors, connect } = useConnect();

  return (
    <div className="flex w-fit flex-col rounded-md border-[2px] border-red-500 p-4">
      {connectors.map((connector) => (
        <button key={connector.uid} onClick={() => connect({ connector })}>
          {connector.name}
        </button>
      ))}
    </div>
  );
};
