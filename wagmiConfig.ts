import { http, createConfig } from 'wagmi';
import { sepolia, localhost } from 'wagmi/chains';
import { metaMask, walletConnect } from 'wagmi/connectors';

const projectId = 'ae2417e63e6803e7ad042abdf9f6ca82';

export const wagmiConfig = createConfig({
  chains: [sepolia, localhost],
  connectors: [walletConnect({ projectId }), metaMask()],
  transports: {
    [sepolia.id]: http(),
    [localhost.id]: http(),
  },
});

export const currentChain = sepolia;
