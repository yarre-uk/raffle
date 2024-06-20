import { WriteContractErrorType } from '@wagmi/core';
import { BaseError } from 'wagmi';

type TransactionInfoProps = {
  hash: `0x${string}` | undefined;
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

export default TransactionInfo;
