import { Card } from '@/components';
import { GameInfo, Play } from '@/features';

const PlayPage = () => {
  return (
    <div className="max-w-screen flex min-h-screen flex-col items-center justify-center gap-4 py-4">
      <Card className="flex min-h-[60%] w-[80%] max-w-[800px] flex-col items-center justify-center gap-12 p-8">
        <Play />
        <GameInfo />
      </Card>
    </div>
  );
};

export default PlayPage;
