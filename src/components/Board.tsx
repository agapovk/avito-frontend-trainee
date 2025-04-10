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
import TaskForm from './TaskForm';

export default function BoardPage() {
  const { id } = useParams<{ id: string }>();
  const [board, setBoard] = useState<Board | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);

  const fetchBoardTasks = useCallback(async () => {
    try {
      const response = await fetch(`http://localhost:8080/api/v1/boards/${id}`);
      const { data } = await response.json();
      setTasks(data);
    } catch (error) {
      console.error('Error fetching board tasks:', error);
    }
  }, [id]);

  const fetchBoard = useCallback(async () => {
    try {
      const response = await fetch(`http://localhost:8080/api/v1/boards`);
      const { data } = await response.json();
      const boardById = id ? data.find((board: Board) => board.id === parseInt(id)) : null;
      setBoard(boardById);
    } catch (error) {
      console.error('Error fetching board:', error);
    }
  }, [id]);

  useEffect(() => {
    fetchBoard();
    fetchBoardTasks();
  }, [id, fetchBoard, fetchBoardTasks]);

  // Group the tasks by their status
  const groupedTasks = tasks.reduce((acc, task) => {
    acc[task.status] = acc[task.status] || [];
    acc[task.status].push(task);
    return acc;
  }, {} as Record<string, Task[]>);

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
                              'w-full text-left px-3 block truncate border-l-8',
                              statusMap[task.status as keyof typeof statusMap].border,
                            )}
                          >
                            {task.title}
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-4xl">
                          <DialogHeader>
                            <DialogTitle>Редактирование задачи</DialogTitle>
                            <DialogDescription>{task.title}</DialogDescription>
                          </DialogHeader>
                          <TaskForm {...task} />
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
