'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Board, Task } from '@/types';
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
import { cn, statusMap } from '@/lib/utils';
import { Link } from 'react-router-dom';
import { useEffect } from 'react';
import { useUnit } from 'effector-react';
import { $boards, $users, fetchBoardsFx, fetchUsersFx } from '@/store/store';
import { dbClient } from '@/services/dbClient';
import { toast } from 'sonner';

const statuses = ['Backlog', 'InProgress', 'Done'];
const priorities = ['Low', 'Medium', 'High'];

const formSchema = z.object({
  title: z.string().min(2),
  description: z.string().min(2),
  status: z.enum(['Backlog', 'InProgress', 'Done']),
  priority: z.enum(['Low', 'Medium', 'High']),
  boardId: z.coerce.number(),
  assigneeId: z.coerce.number(),
});

export default function EditForm({
  task,
  board,
  showBoardButton = false,
  disableBoardField = false,
  setIsEditModalOpen,
  fetchAction,
  fetchBoardTasks,
}: {
  task: Task;
  board: Board | undefined;
  showBoardButton?: boolean;
  disableBoardField?: boolean;
  setIsEditModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  fetchAction?: () => void;
  fetchBoardTasks?: (boardId: string) => Promise<void>;
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
      title: task.title,
      description: task.description,
      status: task.status as keyof typeof formSchema.shape.status.enum,
      priority: task.priority as keyof typeof formSchema.shape.priority.enum,
      boardId: board?.id,
      assigneeId: task.assignee.id,
    },
  });

  const { isDirty } = form.formState;

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      await dbClient.updateTask(task.id, values);
      form.reset();
      setIsEditModalOpen(false);
      if (fetchBoardTasks && board?.id) {
        fetchBoardTasks(board.id.toString());
      }
      if (fetchAction) {
        fetchAction();
      }
      toast.success('Задача обновлена');
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
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
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value?.toString()}
                disabled={disableBoardField ? true : false}
              >
                <FormControl>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Выберите проект" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {boards.map((board) => (
                    <SelectItem key={board.id} value={board.id?.toString()}>
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
              <Select onValueChange={field.onChange} defaultValue={field.value}>
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
          name="status"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>Статус</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Статус" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {statuses.map((status, index) => (
                    <SelectItem key={index} value={status}>
                      {statusMap[status as keyof typeof statusMap].title}
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
              <Select onValueChange={field.onChange} defaultValue={field.value.toString()}>
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
          <Link
            to={`/board/${board?.id}`}
            className={cn('hidden', showBoardButton && 'mr-auto flex')}
          >
            <Button variant="outline">Перейти на доску</Button>
          </Link>
          <Button type="submit" disabled={!isDirty}>
            Сохранить
          </Button>
        </div>
      </form>
    </Form>
  );
}
