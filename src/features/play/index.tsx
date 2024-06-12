import ApproveCard from './components/approve';
import DepositCard from './components/deposit';
import WithdrawCard from './components/withdraw';

import { Card, Tabs, TabsContent, TabsList, TabsTrigger } from '@/components';

const TabsDemo = () => {
  return (
    <Card className="p-4">
      <Tabs defaultValue="deposit" className="w-[600px]">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="deposit">Deposit</TabsTrigger>
          <TabsTrigger value="withdraw">Withdraw</TabsTrigger>
          <TabsTrigger value="approve">Approve</TabsTrigger>
        </TabsList>
        <TabsContent value="deposit">
          <DepositCard />
        </TabsContent>
        <TabsContent value="withdraw">
          <WithdrawCard />
        </TabsContent>
        <TabsContent value="approve">
          <ApproveCard />
        </TabsContent>
      </Tabs>
    </Card>
  );
};

export default TabsDemo;
