import { Board } from '@/types'
import { Card, CardContent } from './ui/card'
import { Button } from './ui/button'
import { Link } from 'react-router-dom'

export default function BoardCard(board: Board) {
  return (
    <Card className="p-0">
      <CardContent className="py-4 flex justify-between items-center gap-4">
        <div className="flex-1">
          <h3 className="font-semibold">{board.name}</h3>
          <p className="text-muted-foreground text-sm">{board.description}</p>
        </div>
        <Button variant="link" className="px-0">
          <Link to={`/board/${board.id}`}>Перейти к доске</Link>
        </Button>
      </CardContent>
    </Card>
  )
}
