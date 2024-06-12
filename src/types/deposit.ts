export type DepositEvent = {
  raffleId: bigint;
  sender: `0x${string}`;
  prevDeposit: `0x${string}`;
  id: `0x${string}`;
};

export type DepositData = {
  raffleId: bigint;
  sender: `0x${string}`;
  amount: bigint;
  point: bigint;
  prevDeposit: `0x${string}`;
};

export type FullDepositEvent = { event: DepositEvent; deposit: DepositData };
