import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { erc20Abi } from 'viem';
import {
  useAccount,
  usePublicClient,
  useWaitForTransactionReceipt,
  useWriteContract,
} from 'wagmi';
import { currentChain } from 'wagmiConfig';
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
  FormControl,
  RadioGroup,
  RadioGroupItem,
  TransactionInfo,
} from '@/components';
import {
  proxyRaffleAbi,
  approvedTokensInfo,
  proxyRaffleAddress,
  approvedTokens,
} from '@/constants';

const depositTypes = ['basic', 'approve'] as const;

const formSchema = z.object({
  type: z.enum(depositTypes, {
    required_error: 'You need to select a notification type.',
  }),
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
      type: 'basic',
    } as z.infer<typeof formSchema>,
  });

  const { address } = useAccount();
  const {
    data: hash,
    error,
    writeContract,
    writeContractAsync,
  } = useWriteContract();

  const publicClient = usePublicClient();

  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({
      hash,
    });

  const basicDeposit = async (data: z.infer<typeof formSchema>) => {
    writeContract({
      address: proxyRaffleAddress,
      abi: proxyRaffleAbi,
      functionName: 'deposit',
      args: [BigInt(data.amount), BigInt(data.token)],
      chain: currentChain,
      account: address,
    });
  };

  const approveDeposit = async (data: z.infer<typeof formSchema>) => {
    const approveHash = await writeContractAsync({
      address: approvedTokens[Number(data.token)],
      abi: erc20Abi,
      functionName: 'approve',
      args: [proxyRaffleAddress, BigInt(data.token)],
      chain: currentChain,
      account: address,
    });

    if (!publicClient || !approveHash) {
      throw new Error('Something went wrong');
    }

    await publicClient.waitForTransactionReceipt({
      hash: approveHash,
    });

    writeContract({
      address: proxyRaffleAddress,
      abi: proxyRaffleAbi,
      functionName: 'deposit',
      args: [BigInt(data.amount), BigInt(data.token)],
      chain: currentChain,
      account: address,
    });
  };

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    switch (data.type) {
      case 'basic':
        basicDeposit(data);
        break;
      case 'approve':
        approveDeposit(data);
        break;
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex w-full flex-col gap-4"
      >
        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel>Select deposit type</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="flex flex-row items-center space-x-4 space-y-0"
                >
                  {depositTypes.map((type) => (
                    <FormItem
                      key={type}
                      className="flex items-center space-x-3 space-y-0"
                    >
                      <FormControl>
                        <RadioGroupItem value={type} />
                      </FormControl>
                      <FormLabel className="font-normal">
                        {type.charAt(0).toUpperCase() + type.slice(1)}
                      </FormLabel>
                    </FormItem>
                  ))}
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
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

export default DepositCard;
