import { Card } from '@/components';
import Governance from '@/features/governance';

const GovernancePage = () => {
  return (
    <div className="max-w-screen flex min-h-screen flex-col items-center justify-center gap-4 py-4">
      <Card className="flex min-h-[60%] w-[80%] max-w-[800px] flex-col items-center justify-center gap-12 p-8">
        <Governance />
      </Card>
    </div>
  );
};

export default GovernancePage;
