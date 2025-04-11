import { useEffect, useState, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { Board, Task } from '../types';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { cn, statusMap } from '@/lib/utils';
import { dbClient } from '@/services/dbClient';
import EditForm from './EditForm';

export default function BoardPage() {
  const { id } = useParams<{ id: string }>();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [boards, setBoards] = useState<Board[]>([]);

  const fetchBoardTasks = useCallback(async () => {
    if (!id) return;
    try {
      const data = await dbClient.getBoardTasks(id);
      setTasks(data);
    } catch (error) {
      console.error('Error fetching board tasks:', error);
    }
  }, [id]);

  const fetchBoards = useCallback(async () => {
    if (!id) return;
    try {
      const data = await dbClient.getBoards();
      setBoards(data);
    } catch (error) {
      console.error('Error fetching board:', error);
    }
  }, [id]);

  useEffect(() => {
    fetchBoards();
    fetchBoardTasks();
  }, [id, fetchBoards, fetchBoardTasks]);

  // Group the tasks by their status
  const groupedTasks = tasks.reduce((acc, task) => {
    acc[task.status] = acc[task.status] || [];
    acc[task.status].push(task);
    return acc;
  }, {} as Record<string, Task[]>);

  const board = boards.find((board) => board.id === Number(id));

  if (!board) {
    return <p>No Board found</p>;
  }

  return (
    <>
      <section className="space-y-2">
        <h2 className="font-semibold text-xl bg-">{board.name}</h2>
        <p className="text-muted-foreground">{board.description}</p>
      </section>
      <section className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {Object.entries(groupedTasks)
            // Sort the statuses by their order
            .sort(
              (a, b) =>
                statusMap[a[0] as keyof typeof statusMap].order -
                statusMap[b[0] as keyof typeof statusMap].order,
            )
            // And map them
            .map(([status, tasks]) => (
              <div key={status} className="space-y-4">
                <h3 className="font-semibold text-center">
                  {statusMap[status as keyof typeof statusMap].title}
                </h3>
                <ul className="space-y-4">
                  {tasks.map((task) => (
                    <li key={task.id}>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="lg"
                            className={cn(
                              'w-full h-auto text-left px-3 block truncate border-l-8',
                              statusMap[task.status as keyof typeof statusMap].border,
                            )}
                          >
                            <div className="flex flex-col py-2 gap-2">
                              <p className="truncate">{task.title}</p>
                              <div className="text-muted-foreground text-xs flex justify-between items-center">
                                <span>{task.assignee.fullName}</span>
                                <span>{task.priority}</span>
                              </div>
                            </div>
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-4xl">
                          <DialogHeader>
                            <DialogTitle>Редактирование задачи</DialogTitle>
                            <DialogDescription>Заполните форму</DialogDescription>
                          </DialogHeader>
                          <EditForm task={task} board={board} disableBoardField={true} />
                        </DialogContent>
                      </Dialog>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
        </div>
      </section>
    </>
  );
}
