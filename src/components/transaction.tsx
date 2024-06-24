import { WriteContractErrorType } from '@wagmi/core';
import { memo } from 'react';
import { BaseError } from 'wagmi';

import { bytes } from '@/types';

type TransactionInfoProps = {
  hash: bytes | undefined;
  isConfirming: boolean;
  isConfirmed: boolean;
  error: WriteContractErrorType | null;
};

const TransactionInfo = ({
  error,
  hash,
  isConfirmed,
  isConfirming,
}: TransactionInfoProps) => {
  return (
    <div>
      {hash && <div>Transaction Hash: {hash}</div>}
      {isConfirming && <div>Waiting for confirmation...</div>}
      {isConfirmed && <div>Transaction confirmed.</div>}
      {error && (
        <div>Error: {(error as BaseError).shortMessage || error.message}</div>
      )}
    </div>
  );
};

export default memo(TransactionInfo);
