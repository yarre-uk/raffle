import { bytes } from '@/types';

export type DepositEvent = {
  raffleId: bigint;
  sender: bytes;
  prevDeposit: bytes;
  id: bytes;
};

export type DepositData = {
  raffleId: bigint;
  sender: bytes;
  amount: bigint;
  point: bigint;
  prevDeposit: bytes;
};

export type FullDepositEvent = { event: DepositEvent; deposit: DepositData };
