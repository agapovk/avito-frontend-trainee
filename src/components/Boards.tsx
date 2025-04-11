import { useCallback, useEffect, useState } from 'react';
import { Board } from '../types';
import BoardCard from './BoardCard';
import { dbClient } from '@/services/dbClient';

export default function Boards() {
  const [boards, setBoards] = useState<Board[]>([]);

  const fetchBoards = useCallback(async () => {
    try {
      const data = await dbClient.getBoards();
      setBoards(data);
    } catch (error) {
      console.error(error);
    }
  }, []);

  useEffect(() => {
    fetchBoards();
  }, [fetchBoards]);

  return (
    <>
      <section className="space-y-4">
        <ul className="space-y-4 mx-auto max-w-2xl">
          {boards.map((board) => (
            <li key={board.id}>
              <BoardCard board={board} />
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
