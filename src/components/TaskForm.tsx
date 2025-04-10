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

const statuses = ['Backlog', 'InProgress', 'Done'];
const priorities = ['Low', 'Medium', 'High'];

const formSchema = z.object({
  id: z.number(),
  title: z.string().min(2),
  description: z.string().min(2),
  board: z.string(),
  status: z.enum(['Backlog', 'InProgress', 'Done']),
  priority: z.enum(['Low', 'Medium', 'High']),
  assigneeId: z.string(),
});

export default function TaskForm({
  task,
  board,
  showBoardButton,
}: {
  task?: Task | null;
  board?: Board | null;
  showBoardButton: boolean;
}) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      id: task ? task.id : undefined,
      title: task ? task.title : undefined,
      description: task ? task.description : undefined,
      board: board ? board.name : undefined,
      status: task ? (task.status as keyof typeof formSchema.shape.status.enum) : undefined,
      priority: task ? (task.priority as keyof typeof formSchema.shape.priority.enum) : undefined,
      assigneeId: task ? task.assignee.id.toString() : undefined,
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
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
          name="board"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>Проект</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
                disabled={board ? true : false}
              >
                <FormControl>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Выберите проект" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {boards.map((b) => (
                    <SelectItem key={b.id} value={b.name}>
                      {b.name}
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
              <Select onValueChange={field.onChange} defaultValue={field.value}>
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
          <Button type="submit">Обновить</Button>
        </div>
      </form>
    </Form>
  );
}

const users = [
  {
    id: 1,
    fullName: 'Александра Ветрова',
    email: 'al.vetrova@avito.ru',
    description: 'Frontend Tech Lead',
    avatarUrl: 'https://randomuser.me/api/portraits/women/1.jpg',
    teamId: 1,
    teamName: 'Frontend Team',
    tasksCount: 7,
  },
  {
    id: 2,
    fullName: 'Илья Романов',
    email: 'il.romanov@avito.ru',
    description: 'Senior Frontend Developer',
    avatarUrl: 'https://randomuser.me/api/portraits/men/1.jpg',
    teamId: 1,
    teamName: 'Frontend Team',
    tasksCount: 12,
  },
  {
    id: 3,
    fullName: 'Дмитрий Козлов',
    email: 'dm.kozlov@avito.ru',
    description: 'Backend Architect',
    avatarUrl: 'https://randomuser.me/api/portraits/men/2.jpg',
    teamId: 2,
    teamName: 'Backend Team',
    tasksCount: 8,
  },
  {
    id: 4,
    fullName: 'Екатерина Смирнова',
    email: 'ek.smirnova@avito.ru',
    description: 'Senior Backend Developer',
    avatarUrl: 'https://randomuser.me/api/portraits/women/2.jpg',
    teamId: 2,
    teamName: 'Backend Team',
    tasksCount: 9,
  },
  {
    id: 5,
    fullName: 'Артем Белов',
    email: 'ar.belov@avito.ru',
    description: 'QA Automation Lead',
    avatarUrl: 'https://randomuser.me/api/portraits/men/3.jpg',
    teamId: 3,
    teamName: 'QA Team',
    tasksCount: 5,
  },
  {
    id: 6,
    fullName: 'Ольга Новикова',
    email: 'ol.novikova@avito.ru',
    description: 'Manual QA Engineer',
    avatarUrl: 'https://randomuser.me/api/portraits/women/3.jpg',
    teamId: 3,
    teamName: 'QA Team',
    tasksCount: 3,
  },
  {
    id: 7,
    fullName: 'Максим Орлов',
    email: 'mx.orlov@avito.ru',
    description: 'DevOps Engineer',
    avatarUrl: 'https://randomuser.me/api/portraits/men/4.jpg',
    teamId: 4,
    teamName: 'DevOps Team',
    tasksCount: 7,
  },
];

const boards = [
  {
    id: 1,
    name: 'Редизайн карточки товара',
    description: 'Обновление UI/UX основных страниц',
    taskCount: 10,
  },
  {
    id: 2,
    name: 'Оптимизация производительности',
    description: 'Улучшение Core Web Vitals',
    taskCount: 9,
  },
  {
    id: 3,
    name: 'Рефакторинг API',
    description: 'Оптимизация серверных методов',
    taskCount: 10,
  },
  {
    id: 4,
    name: 'Миграция на новую БД',
    description: 'Перенос данных на PostgreSQL 15',
    taskCount: 7,
  },
  {
    id: 5,
    name: 'Автоматизация тестирования',
    description: 'Написание E2E тестов',
    taskCount: 8,
  },
  {
    id: 6,
    name: 'Переход на Kubernetes',
    description: 'Миграция инфраструктуры',
    taskCount: 7,
  },
];
