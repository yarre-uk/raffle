import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
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
  TransactionInfo,
} from '@/components';

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
  x: z.coerce
    .number()
    .positive({ message: 'Amount must be a positive number' }),
  y: z.coerce
    .number()
    .positive({ message: 'Amount must be a positive number' }),
  z: z.coerce
    .number()
    .positive({ message: 'Amount must be a positive number' }),
});

const DepositCard = () => {
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: { items: [''] } as z.infer<typeof formSchema>,
  });

  const { data: hash, error } = useWriteContract();

  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({
      hash,
    });

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    console.log(data);
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
            {' '}
            <FormField
              control={form.control}
              name="x"
              disabled={!form.getValues('items').includes('setX')}
              render={({ field }) => (
                <FormItem className="h-16">
                  <FormLabel>Amount X</FormLabel>
                  <Input type="number" {...field} />
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
                  <Input type="number" {...field} />
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
                  <Input type="number" {...field} />
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

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
