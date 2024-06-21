import { useAccount, useReadContract } from 'wagmi';

import CreateCard from './components/create';
import OwnerCard from './components/owner';
import ProcessCard from './components/process';
import VoteCard from './components/vote';

import { Card, Tabs, TabsContent, TabsList, TabsTrigger } from '@/components';
import { proxyGovernanceAbi, proxyGovernanceAddress } from '@/constants';
import { cn } from '@/lib';

const Governance = () => {
  const { address } = useAccount();

  const { data: owner } = useReadContract({
    abi: proxyGovernanceAbi,
    address: proxyGovernanceAddress,
    functionName: 'owner',
  });

  const isOwner = address === owner;

  return (
    <Card className="w-full p-4">
      <Tabs
        defaultValue="create"
        className="mx-auto flex w-full flex-col items-center justify-center"
      >
        <TabsList
          className={cn('grid w-full', isOwner ? 'grid-cols-4' : 'grid-cols-3')}
        >
          <TabsTrigger value="create">Create</TabsTrigger>
          <TabsTrigger value="vote">Vote</TabsTrigger>
          <TabsTrigger value="process">Process</TabsTrigger>
          {isOwner && <TabsTrigger value="owner">Owner</TabsTrigger>}
        </TabsList>
        <TabsContent className="w-full" value="create">
          <CreateCard />
        </TabsContent>
        <TabsContent className="w-full" value="vote">
          <VoteCard />
        </TabsContent>
        <TabsContent className="w-full" value="process">
          <ProcessCard />
        </TabsContent>
        {isOwner && (
          <TabsContent className="w-full" value="owner">
            <OwnerCard />
          </TabsContent>
        )}
      </Tabs>
    </Card>
  );
};

export default Governance;
