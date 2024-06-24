export const weth = '0x7b79995e5f793A07Bc00c21412e50Ecae098E7f9';
export const link = '0x779877A7B0D9E8603169DdbD7836e478b4624789';

export const approvedTokens: `0x${string}`[] = [weth, link];

export const approvedTokensInfo = [
  { address: weth, name: 'WETH', id: 0 },
  { address: link, name: 'LINK', id: 1 },
];

export const proxyRaffleAddress: `0x${string}` = import.meta.env
  .VITE_PROXY_RAFFLE_CONTRACT_ADDRESS;
export const proxyGovernanceAddress: `0x${string}` = import.meta.env
  .VITE_PROXY_GOVERNANCE_CONTRACT_ADDRESS;

if (!proxyRaffleAddress || !proxyGovernanceAddress) {
  console.log('proxyRaffleAddress ->', proxyRaffleAddress);
  console.log('proxyGovernanceAddress ->', proxyGovernanceAddress);
  throw new Error('Proxy contract addresses are not set');
}
