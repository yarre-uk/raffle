import { useAccount, useReadContract } from 'wagmi';

import AllCard from './components/all';
import CreateCard from './components/create';
import ProcessCard from './components/process';
import ProcessedCard from './components/processed';
import VoteCard from './components/vote';

import { Card, Tabs, TabsContent, TabsList, TabsTrigger } from '@/components';
import {
  EXECUTER_ROLE,
  proxyGovernanceAbi,
  proxyGovernanceAddress,
} from '@/constants';
import { cn } from '@/lib';

const Governance = () => {
  const { address } = useAccount();

  const { data: isExecuter } = useReadContract({
    abi: proxyGovernanceAbi,
    address: proxyGovernanceAddress,
    functionName: 'hasRole',
    args: [EXECUTER_ROLE, address ?? '0x'],
  });

  return (
    <>
      <Card className="w-full p-4">
        <Tabs
          defaultValue="create"
          className="mx-auto flex w-full flex-col items-center justify-center"
        >
          <TabsList
            className={cn(
              'grid w-full',
              isExecuter ? 'grid-cols-3' : 'grid-cols-2',
            )}
          >
            <TabsTrigger value="create">Create</TabsTrigger>
            <TabsTrigger value="vote">Vote</TabsTrigger>
            {isExecuter && <TabsTrigger value="process">Process</TabsTrigger>}
          </TabsList>
          <TabsContent className="w-full" value="create">
            <CreateCard />
          </TabsContent>
          <TabsContent className="w-full" value="vote">
            <VoteCard />
          </TabsContent>
          {isExecuter && (
            <TabsContent className="w-full" value="process">
              <ProcessCard />
            </TabsContent>
          )}
        </Tabs>
      </Card>
      <Card className="flex w-full flex-col gap-16 p-4">
        <AllCard />
        <ProcessedCard />
      </Card>
    </>
  );
};

export default Governance;
