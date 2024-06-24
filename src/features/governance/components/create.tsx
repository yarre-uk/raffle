import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { encodeFunctionData } from 'viem';
import { useWaitForTransactionReceipt, useWriteContract } from 'wagmi';
import { z } from 'zod';

import {
  Button,
  Checkbox,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  Textarea,
  TransactionInfo,
} from '@/components';
import {
  proxyGovernanceAddress,
  proxyGovernanceAbi,
  proxyRaffleAbi,
} from '@/constants';
import { bytes } from '@/types';

const items = [
  {
    id: 'setX',
    label: 'Update X',
  },
  {
    id: 'setY',
    label: 'Update Y',
  },
  {
    id: 'setZ',
    label: 'Update Z',
  },
] as const;

const formSchema = z.object({
  items: z
    .array(z.string())
    .refine((value) => value.some((item) => item), {
      message: 'You have to select at least one item.',
    })
    .transform((value) => value.filter((item) => item !== '')),
  x: z.coerce.number().optional(),
  y: z.coerce.number().optional(),
  z: z.coerce.number().optional(),
  description: z.string().min(1, { message: 'Description is required' }),
});

const encodeParams = (
  functionName: 'setX' | 'setY' | 'setZ',
  amount: number,
) => {
  return encodeFunctionData({
    abi: proxyRaffleAbi,
    functionName,
    args: [BigInt(amount)],
  });
};

const CreateCard = () => {
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      items: [],
      description: '',
      x: 0,
      y: 0,
      z: 0,
    } as z.infer<typeof formSchema>,
    mode: 'onChange',
  });

  const { data: hash, error, writeContract } = useWriteContract();

  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({
      hash,
    });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    const calldatas: bytes[] = data.items.map((item) => {
      switch (item) {
        case 'setX':
          if (data.x === undefined) {
            form.setError('x', { message: 'Amount X is required' });
            return '0x';
          }
          return encodeParams('setX', data.x);
        case 'setY':
          if (data.y === undefined) {
            form.setError('y', { message: 'Amount Y is required' });
            return '0x';
          }
          return encodeParams('setY', data.y);
        case 'setZ':
          if (data.z === undefined) {
            form.setError('z', { message: 'Amount Z is required' });
            return '0x';
          }
          return encodeParams('setZ', data.z);
        default:
          throw new Error('Invalid item');
      }
    });

    if (calldatas.some((calldata) => calldata === '0x')) {
      throw new Error('Invalid calldata');
    }

    writeContract({
      abi: proxyGovernanceAbi,
      address: proxyGovernanceAddress,
      functionName: 'createProposal',
      args: [calldatas, data.description],
    });
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex w-full flex-col gap-4"
      >
        <div className="grid min-h-[300px] grid-cols-3">
          <FormField
            control={form.control}
            name="items"
            render={() => (
              <FormItem className="col-span-1 flex h-full w-full flex-col justify-evenly">
                {items.map((item) => (
                  <FormField
                    key={item.id}
                    control={form.control}
                    name="items"
                    render={({ field }) => {
                      return (
                        <FormItem
                          key={item.id}
                          className="flex h-16 w-full flex-row items-center justify-center gap-4"
                        >
                          <FormControl>
                            <Checkbox
                              checked={field.value?.includes(item.id)}
                              onCheckedChange={(checked) => {
                                return checked
                                  ? field.onChange([...field.value, item.id])
                                  : field.onChange(
                                      field.value?.filter(
                                        (value) => value !== item.id,
                                      ),
                                    );
                              }}
                            />
                          </FormControl>
                          <FormLabel className="cursor-pointer font-normal">
                            {item.label}
                          </FormLabel>
                        </FormItem>
                      );
                    }}
                  />
                ))}
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="col-span-2 flex h-full flex-col justify-evenly">
            <FormField
              control={form.control}
              name="x"
              disabled={!form.getValues('items').includes('setX')}
              render={({ field }) => (
                <FormItem className="h-16">
                  <FormLabel>Amount X</FormLabel>
                  <Input
                    type="number"
                    {...field}
                    value={field.value}
                    onChange={field.onChange}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="y"
              disabled={!form.getValues('items').includes('setY')}
              render={({ field }) => (
                <FormItem className="h-16">
                  <FormLabel>Amount Y</FormLabel>
                  <Input
                    type="number"
                    {...field}
                    value={field.value}
                    onChange={field.onChange}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="z"
              disabled={!form.getValues('items').includes('setZ')}
              render={({ field }) => (
                <FormItem className="h-16">
                  <FormLabel>Amount Z</FormLabel>
                  <Input
                    type="number"
                    {...field}
                    value={field.value}
                    onChange={field.onChange}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <Textarea {...field} />
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

export default CreateCard;
