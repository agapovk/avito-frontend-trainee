import { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Task } from '../types';
import { statusMap } from '@/lib/utils';
import { $boards, fetchBoardsFx } from '@/store/store';
import { useUnit } from 'effector-react';
import { dbClient } from '@/services/dbClient';
import BoardPageDialog from './BoardPageDialog';

export default function BoardPage() {
  const { id } = useParams<{ id: string }>();
  const [tasks, setTasks] = useState<Task[]>([]);
  const boards = useUnit($boards);

  const fetchBoardTasks = useCallback(async (boardId: string) => {
    try {
      const data = await dbClient.getBoardTasks(boardId);
      setTasks(data);
    } catch (error) {
      console.log(error);
    }
  }, []);

  useEffect(() => {
    fetchBoardsFx();
    if (id) fetchBoardTasks(id);
  }, []);

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
                      <BoardPageDialog
                        task={task}
                        board={board}
                        fetchBoardTasks={fetchBoardTasks}
                      />
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
