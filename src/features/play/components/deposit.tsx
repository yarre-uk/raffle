import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { sepolia } from 'viem/chains';
import {
  BaseError,
  useAccount,
  useWaitForTransactionReceipt,
  useWriteContract,
} from 'wagmi';
import { z } from 'zod';

import {
  Button,
  Input,
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Form,
  FormField,
  FormLabel,
  FormMessage,
  FormDescription,
  FormItem,
} from '@/components';
import { abi, proxyAddress } from '@/constants';

const formSchema = z.object({
  token: z.string().min(1, { message: 'Please select a token' }),
  amount: z.coerce
    .number()
    .positive({ message: 'Amount must be a positive number' }),
});

const DepositCard = () => {
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      token: '',
      amount: 0,
    },
  });

  const { address } = useAccount();
  const { data: hash, error, writeContract } = useWriteContract();

  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({
      hash,
    });

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    console.log(data);

    writeContract({
      address: proxyAddress,
      abi,
      functionName: 'deposit',
      args: [BigInt(data.amount), BigInt(data.token)],
      chain: sepolia,
      account: address,
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full">
        <FormField
          control={form.control}
          name="token"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tokens</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a token" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="0">USDT</SelectItem>
                    <SelectItem value="1">USDC</SelectItem>
                    <SelectItem value="3">LINK</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
              <FormDescription>
                Currently supported tokens: USDT, USDC, LINK
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

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
        {hash && <div>Transaction Hash: {hash}</div>}
        {isConfirming && <div>Waiting for confirmation...</div>}
        {isConfirmed && <div>Transaction confirmed.</div>}
        {error && (
          <div>Error: {(error as BaseError).shortMessage || error.message}</div>
        )}
      </form>
    </Form>
  );
};

export default DepositCard;
