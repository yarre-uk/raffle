import DepositCard from './components/deposit';
import WithdrawCard from './components/withdraw';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components';

const TabsDemo = () => {
  return (
    <Tabs defaultValue="deposit" className="w-[400px]">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="deposit">Deposit</TabsTrigger>
        <TabsTrigger value="withdraw">Withdraw</TabsTrigger>
      </TabsList>
      <TabsContent value="deposit">
        <DepositCard />
      </TabsContent>
      <TabsContent value="withdraw">
        <WithdrawCard />
      </TabsContent>
    </Tabs>
  );
};

export default TabsDemo;
