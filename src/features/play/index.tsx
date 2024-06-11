import AdminCard from './components/admin';
import ApproveCard from './components/approve';
import DepositCard from './components/deposit';
import WithdrawCard from './components/withdraw';

import { Card, Tabs, TabsContent, TabsList, TabsTrigger } from '@/components';
import { cn } from '@/lib';

const TabsDemo = () => {
  // const { data: owner } = useReadContract({
  //   address: proxyAddress,
  //   abi: proxyAbi,
  //   functionName: 'owner',
  // });

  const isOwner = true;

  return (
    <Card className="p-4">
      <Tabs defaultValue="deposit" className="w-[600px]">
        <TabsList
          className={cn('grid w-full', isOwner ? 'grid-cols-4' : 'grid-cols-3')}
        >
          <TabsTrigger value="deposit">Deposit</TabsTrigger>
          <TabsTrigger value="withdraw">Withdraw</TabsTrigger>
          <TabsTrigger value="approve">Approve</TabsTrigger>
          {isOwner && <TabsTrigger value="admin">Admin</TabsTrigger>}
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
        {isOwner && (
          <TabsContent value="admin">
            <AdminCard />
          </TabsContent>
        )}
      </Tabs>
    </Card>
  );
};

export default TabsDemo;
