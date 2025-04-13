import React, { useEffect } from 'react';
import BoardCard from './BoardCard';
import { $boards, fetchBoardsFx } from '@/store/store';
import { useUnit } from 'effector-react';

const MemoizedBoardCard = React.memo(BoardCard);

export default function Boards() {
  const boards = useUnit($boards);

  useEffect(() => {
    fetchBoardsFx();
  }, []);

  return (
    <>
      <section className="space-y-4">
        <ul className="space-y-4 mx-auto max-w-2xl">
          {boards.map((board) => (
            <li key={board.id}>
              <MemoizedBoardCard board={board} />
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
