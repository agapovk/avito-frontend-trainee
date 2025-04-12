'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Textarea } from './ui/textarea';
import { useEffect } from 'react';
import { dbClient } from '@/services/dbClient';
import { toast } from 'sonner';
import { $boards, $users, fetchBoardsFx, fetchIssuesFx, fetchUsersFx } from '@/store/store';
import { useUnit } from 'effector-react';

const priorities = ['Low', 'Medium', 'High'];

const formSchema = z.object({
  title: z.string().min(2),
  description: z.string().min(2),
  priority: z.enum(['Low', 'Medium', 'High']),
  boardId: z.coerce.number(),
  assigneeId: z.coerce.number(),
});

export default function NewForm({
  setIsModalOpen,
}: {
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const users = useUnit($users);
  const boards = useUnit($boards);

  useEffect(() => {
    fetchUsersFx();
    fetchBoardsFx();
  }, []);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      description: undefined,
      priority: undefined,
      boardId: undefined,
      assigneeId: undefined,
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      await dbClient.createTask(values);
      form.reset();
      setIsModalOpen(false);
      fetchIssuesFx();
      toast.success('Задача создана');
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        onError={(e) => console.log(e)}
        className="space-y-8"
      >
        {form.formState.errors.root && (
          <div className="text-destructive text-sm">{form.formState.errors.root.message}</div>
        )}
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Название</FormLabel>
              <FormControl>
                <Input placeholder="Название задачи" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Описание</FormLabel>
              <FormControl>
                <Textarea placeholder="Описание задачи" className="h-32" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="boardId"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>Проект</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value?.toString()}>
                <FormControl>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Выберите проект" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {boards.map((board) => (
                    <SelectItem key={board.id} value={board.id.toString()}>
                      {board.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="priority"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>Приоритет</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value?.toString()}>
                <FormControl>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Выберите приоритет" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {priorities.map((priority, index) => (
                    <SelectItem key={index} value={priority}>
                      {priority}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="assigneeId"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>Исполнитель</FormLabel>
              <Select
                onValueChange={(value) => field.onChange(Number(value))}
                defaultValue={field.value?.toString()}
              >
                <FormControl>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Выберите исполнителя" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {users.map((user) => (
                    <SelectItem key={user.id} value={user.id.toString()}>
                      <span>{user.fullName}</span>
                      <span className="text-muted-foreground">{user.email}</span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-end">
          <Button type="submit">Сохранить</Button>
        </div>
      </form>
    </Form>
  );
}
