import ApproveCard from './components/approve';
import DepositCard from './components/deposit';
import WithdrawCard from './components/withdraw';

import { Card, Tabs, TabsContent, TabsList, TabsTrigger } from '@/components';

const Play = () => {
  return (
    <Card className="w-full p-4">
      <Tabs
        defaultValue="deposit"
        className="flex w-[95%] flex-col items-center justify-center"
      >
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="deposit">Deposit</TabsTrigger>
          <TabsTrigger value="withdraw">Withdraw</TabsTrigger>
          <TabsTrigger value="approve">Approve</TabsTrigger>
        </TabsList>
        <TabsContent className="w-full" value="deposit">
          <DepositCard />
        </TabsContent>
        <TabsContent className="w-full" value="withdraw">
          <WithdrawCard />
        </TabsContent>
        <TabsContent className="w-full" value="approve">
          <ApproveCard />
        </TabsContent>
      </Tabs>
    </Card>
  );
};

export default Play;
