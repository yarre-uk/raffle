import { readContract } from '@wagmi/core';
import { parseAbiItem, decodeEventLog } from 'viem';
import { usePublicClient } from 'wagmi';
import { wagmiConfig } from 'wagmiConfig';

import { proxyGovernanceAbi, proxyGovernanceAddress } from '@/constants';
import { FullProposalEvent, ProposalData, ProposalEvent, bytes } from '@/types';

const useGetProposalEvents = () => {
  const publicClient = usePublicClient();

  const fetchProposal = async (args: {
    id?: bytes | bytes[] | null | undefined;
    sender?: bytes | bytes[] | null | undefined;
  }): Promise<FullProposalEvent[]> => {
    if (!publicClient) {
      throw new Error('Public client not initialized');
    }

    const block = await publicClient.getBlock();
    const logs = await publicClient.getLogs({
      address: proxyGovernanceAddress,
      event: parseAbiItem(
        `event ProposalCreated(bytes32 indexed id, address indexed sender)`,
      ),
      args,
      fromBlock: block.number - 99999n,
      toBlock: block.number,
    });

    const events: ProposalEvent[] = logs.map(
      (log) =>
        decodeEventLog({
          abi: proxyGovernanceAbi,
          ...log,
        }).args,
    );

    const proposals = (await readContract(wagmiConfig, {
      abi: proxyGovernanceAbi,
      address: proxyGovernanceAddress,
      functionName: 'getProposals',
      args: [events.map((event) => event.id)],
    })) as ProposalData[];

    return events.map((event, index) => {
      return {
        event,
        proposal: proposals[index],
      };
    });
  };

  return { fetchProposal };
};

export default useGetProposalEvents;
