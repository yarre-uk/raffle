import * as React from 'react';
import { getAddress } from 'viem';
import { sepolia } from 'viem/chains';
import {
  type BaseError,
  useAccount,
  useWaitForTransactionReceipt,
  useWriteContract,
} from 'wagmi';

import { abi } from './constants/abi';

const usdt = '0xaA8E23Fb1079EA71e0a56F48a2aA51851D8433D0';
const usdc = '0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238';
const link = '0x779877A7B0D9E8603169DdbD7836e478b4624789';

const whitelist: `0x${string}`[] = [usdt, usdc, link];

const uniswapRouter = '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D';

const subId =
  1230560835588391700105489398649300104699330861740292705239295065739960848769n;

const keyHash =
  '0x474e34a077df58807dbe9c96d3c009b23b3c6d0cce433e59bbf5b34f823bc56c';

const vrfCoordinator = '0x8103B0A8A00be2DDC778e6e7eaa21791Cd364625';

export const Initialize = () => {
  const { data: hash, error, isPending, writeContract } = useWriteContract();
  const { address } = useAccount();

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    writeContract({
      address: getAddress('0x8D58396C062586d9c0F42c8b296c3977789F9C9A'),
      abi,
      functionName: 'initialize',
      args: [whitelist, uniswapRouter, subId, keyHash, vrfCoordinator],
      chain: sepolia,
      account: address,
    });
  }

  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({
      hash,
    });

  return (
    <form onSubmit={submit}>
      <button disabled={isPending} type="submit">
        {isPending ? 'Confirming...' : 'Initialize'}
      </button>
      {hash && <div>Transaction Hash: {hash}</div>}
      {isConfirming && <div>Waiting for confirmation...</div>}
      {isConfirmed && <div>Transaction confirmed.</div>}
      {error && (
        <div>Error: {(error as BaseError).message || error.message}</div>
      )}
    </form>
  );
};
