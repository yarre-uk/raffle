import { readContract } from '@wagmi/core';
import { parseAbiItem, decodeEventLog } from 'viem';
import { usePublicClient } from 'wagmi';
import { wagmiConfig } from 'wagmiConfig';

import { proxyRaffleAddress, proxyRaffleAbi } from '@/constants';
import { bytes } from '@/types';
import { DepositData, DepositEvent, FullDepositEvent } from '@/types';

const useGetDepositEvents = () => {
  const publicClient = usePublicClient();

  const fetchDeposits = async (args: {
    raffleId?: bigint | bigint[];
    sender?: bytes | bytes[];
    prevDeposit?: bytes | bytes[];
  }): Promise<FullDepositEvent[]> => {
    if (!publicClient) {
      throw new Error('Public client not initialized');
    }

    const block = await publicClient.getBlock();
    const logs = await publicClient.getLogs({
      address: proxyRaffleAddress,
      event: parseAbiItem(
        `event Deposited(uint256 indexed raffleId, address indexed sender, bytes32 indexed prevDeposit, bytes32 id)`,
      ),
      args,
      fromBlock: block.number - 99999n,
      toBlock: block.number,
    });

    const events: DepositEvent[] = logs.map(
      (log) =>
        decodeEventLog({
          abi: proxyRaffleAbi,
          ...log,
        }).args,
    );

    const deposits = (await readContract(wagmiConfig, {
      abi: proxyRaffleAbi,
      address: proxyRaffleAddress,
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
