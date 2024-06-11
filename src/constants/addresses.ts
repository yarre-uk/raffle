const weth = '0x7b79995e5f793A07Bc00c21412e50Ecae098E7f9';
const link = '0x779877A7B0D9E8603169DdbD7836e478b4624789';

export const approvedTokens: `0x${string}`[] = [weth, link];

export const approvedTokensInfo = [
  { address: weth, name: 'WETH', id: 0 },
  { address: link, name: 'LINK', id: 1 },
];

//TODO move to env
export const proxyAddress: `0x${string}` =
  '0xa818cA7A4869c7C7101d0Ea5E4c455Ef00e698d5';
