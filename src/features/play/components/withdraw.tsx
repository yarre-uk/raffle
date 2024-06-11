import { useState } from 'react';

import { Input } from '@/components';
import useWinner from '@/hooks/useWinner';

const WithdrawCard = () => {
  useWinner();
  const [id, setId] = useState('');

  // const handleClick = async () => {
  //   console.log(result);
  // };

  return (
    <div>
      <p>Withdraw</p>
      <Input value={id} onChange={(e) => setId(e.currentTarget.value)} />
      {/* <Button onClick={handleClick}>Check</Button> */}
    </div>
  );
};

export default WithdrawCard;
