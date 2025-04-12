import { Board } from '@/types';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Link } from 'react-router-dom';

export default function BoardCard({ board }: { board: Board }) {
  return (
    <Card className="p-0">
      <CardContent className="py-4 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 sm:gap-10">
        <div className="flex-1">
          <h3 className="font-semibold truncate">{board.name}</h3>
          <p className="text-muted-foreground text-sm truncate">{board.description}</p>
        </div>
        <div>
          <Button variant="link" className="px-0">
            <Link to={`/board/${board.id}`}>Перейти к доске</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
