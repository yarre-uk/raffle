import { proxyRaffleAbi, proxyRaffleAddress } from '.';

export const proxyContract = {
  address: proxyRaffleAddress,
  abi: proxyRaffleAbi,
} as const;
