import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import {
  BaseError,
  useAccount,
  useReadContract,
  useWaitForTransactionReceipt,
  useWriteContract,
} from 'wagmi';
import { currentChain } from 'wagmiConfig';
import { z } from 'zod';

import {
  Button,
  Input,
  Form,
  FormField,
  FormLabel,
  FormMessage,
  FormItem,
} from '@/components';
import { proxyAbi, proxyAddress } from '@/constants';

const formSchema = z.object({
  amount: z.coerce
    .number()
    .positive({ message: 'Amount must be a positive number' }),
});

const AdminCard = () => {
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      amount: 0,
    } as z.infer<typeof formSchema>,
  });

  const { address } = useAccount();
  const { data: hash, error, writeContract } = useWriteContract();

  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({
      hash,
    });

  const { data: randomWords } = useReadContract({
    address: proxyAddress,
    abi: proxyAbi,
    account: address,
    functionName: 'randomWords',
    args: [0n],
  });

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    writeContract({
      address: proxyAddress,
      abi: proxyAbi,
      functionName: 'fulfillRandomWordsTest',
      args: [0n, [BigInt(data.amount)]],
      chain: currentChain,
      account: address,
    });
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex w-full flex-col gap-4"
      >
        <FormField
          control={form.control}
          name="amount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Amount</FormLabel>
              <Input type="number" {...field} />
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>
        {randomWords && <div>Random Words: {randomWords?.toString()}</div>}
        {hash && <div>Transaction Hash: {hash}</div>}
        {isConfirming && <div>Waiting for confirmation...</div>}
        {isConfirmed && <div>Transaction confirmed.</div>}
        {error && (
          <div>Error: {(error as BaseError).message || error.message}</div>
        )}
      </form>
    </Form>
  );
};

export default AdminCard;
