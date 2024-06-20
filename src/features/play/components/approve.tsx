import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { erc20Abi } from 'viem';
import {
  useAccount,
  useWaitForTransactionReceipt,
  useWriteContract,
} from 'wagmi';
import { currentChain } from 'wagmiConfig';
import { z } from 'zod';

import Allowance from './allowance';

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
  TransactionInfo,
} from '@/components';
import {
  approvedTokens,
  approvedTokensInfo,
  proxyRaffleAddress,
} from '@/constants';

const formSchema = z.object({
  token: z.string().min(1, { message: 'Please select a token' }),
  amount: z.coerce
    .number()
    .positive({ message: 'Amount must be a positive number' }),
});

const ApproveCard = () => {
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      token: '',
      amount: 0,
    } as z.infer<typeof formSchema>,
  });

  const { address } = useAccount();
  const { data: hash, error, writeContract } = useWriteContract();

  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({
      hash,
    });

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    writeContract({
      address: approvedTokens[+data.token],
      abi: erc20Abi,
      functionName: 'approve',
      args: [proxyRaffleAddress, BigInt(data.amount)],
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
                    {approvedTokensInfo.map((token) => (
                      <SelectItem key={token.name} value={`${token.id}`}>
                        {token.name}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
              <FormDescription>
                Currently supported tokens:{' '}
                {approvedTokensInfo.map((t) => t.name).join(', ')}
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
        {address && (
          <Allowance tokenId={+form.getValues().token} address={address} />
        )}
        <TransactionInfo
          error={error}
          hash={hash}
          isConfirmed={isConfirmed}
          isConfirming={isConfirming}
        />
      </form>
    </Form>
  );
};

export default ApproveCard;
