import CreateCard from './components/create';
import ProcessCard from './components/process';
import VoteCard from './components/vote';

import { Card, Tabs, TabsContent, TabsList, TabsTrigger } from '@/components';

const Governance = () => {
  return (
    <Card className="w-full p-4">
      <Tabs
        defaultValue="create"
        className="flex w-[95%] flex-col items-center justify-center"
      >
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="create">Create</TabsTrigger>
          <TabsTrigger value="vote">Vote</TabsTrigger>
          <TabsTrigger value="process">Process</TabsTrigger>
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
      </Tabs>
    </Card>
  );
};

export default Governance;
