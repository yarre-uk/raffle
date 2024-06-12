import { readContract } from '@wagmi/core';
import { parseAbiItem, decodeEventLog } from 'viem';
import { usePublicClient } from 'wagmi';
import { wagmiConfig } from 'wagmiConfig';

import { proxyAddress, proxyAbi } from '@/constants';
import { DepositData, DepositEvent, FullDepositEvent } from '@/types';

const useGetDepositEvents = () => {
  const publicClient = usePublicClient();

  const fetchDeposits = async (args: {
    raffleId?: bigint | bigint[];
    sender?: `0x${string}` | `0x${string}`[];
    prevDeposit?: `0x${string}` | `0x${string}`[];
  }): Promise<FullDepositEvent[]> => {
    const block = await publicClient.getBlock();
    const logs = await publicClient.getLogs({
      address: proxyAddress,
      event: parseAbiItem(
        `event Deposited(uint256 indexed raffleId, address indexed sender, bytes32 indexed prevDeposit, bytes32 id)`,
      ),
      args,
      fromBlock: block.number - 999n,
      toBlock: block.number,
    });

    const events: DepositEvent[] = logs.map(
      (log) =>
        decodeEventLog({
          abi: proxyAbi,
          ...log,
        }).args,
    );

    const deposits = (await readContract(wagmiConfig, {
      abi: proxyAbi,
      address: proxyAddress,
      functionName: 'getDeposits',
      args: [events.map((event) => event.id)],
    })) as DepositData[];

    return events.map((event, index) => {
      return {
        event,
        deposit: deposits[index],
      };
    });
  };

  return fetchDeposits;
};

export default useGetDepositEvents;
