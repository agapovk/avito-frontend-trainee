import { useEffect, useState, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { Board, Task } from '../types';
import { statusMap } from '@/lib/utils';
import BoardDialog from './BoardDialog';
import { dbClient } from '@/services/dbclient';

export default function BoardPage() {
  const { id } = useParams<{ id: string }>();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [board, setBoard] = useState<Board | null>(null);

  const fetchBoardTasks = useCallback(async () => {
    if (!id) return;
    try {
      const data = await dbClient.getBoardTasks(id);
      setTasks(data);
    } catch (error) {
      console.error('Error fetching board tasks:', error);
    }
  }, [id]);

  const fetchBoard = useCallback(async () => {
    if (!id) return;
    try {
      const data = await dbClient.getBoard(id);
      setBoard(data);
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
                      <BoardDialog task={task} board={board} />
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
