import React, { useEffect, useMemo } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Task } from '../types';
import { statusMap } from '@/lib/utils';
import { $boards, fetchBoardsFx } from '@/store/store';
import { useUnit } from 'effector-react';
import { $boardTasks, fetchBoardTasksFx } from '@/store/store';
import BoardPageDialog from './BoardPageDialog';
import { Button } from './ui/button';

export default function BoardPage() {
  const { id } = useParams<{ id: string }>();
  const boards = useUnit($boards);
  const boardTasks = useUnit($boardTasks);
  const tasks = useMemo(() => (id ? boardTasks[id] ?? [] : []), [id, boardTasks]);

  useEffect(() => {
    fetchBoardsFx();
    if (id) {
      fetchBoardTasksFx(id);
    }
  }, [id]);

  // Group the tasks by their status
  const groupedTasks = useMemo(() => {
    return tasks.reduce((acc, task) => {
      acc[task.status] = acc[task.status] || [];
      acc[task.status].push(task);
      return acc;
    }, {} as Record<string, Task[]>);
  }, [tasks]);

  const board = useMemo(() => boards.find((b) => b.id === Number(id)), [boards, id]);

  if (!board) {
    return (
      <div className="flex flex-col w-full items-center gap-4 mt-8">
        <Link to="/">
          <Button variant="outline">К списку проектов</Button>
        </Link>
        <p>Проект не найден</p>
      </div>
    );
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
            // Sort the statuses: todo -> in progress -> done
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
                      <MemoizedBoardPageDialog task={task} board={board} />
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

const MemoizedBoardPageDialog = React.memo(BoardPageDialog);
