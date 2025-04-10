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
import { Board, Task } from '@/types';

export default function BoardDialog({
  task,
  board,
  showBoardButton = false,
}: {
  task: Task | null;
  board: Board | null;
  showBoardButton?: boolean;
}) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        {task ? (
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
        ) : (
          <Button>Создать задачу</Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>{task ? 'Редактирование задачи' : 'Создание задачи'}</DialogTitle>
          <DialogDescription>Заполните форму</DialogDescription>
        </DialogHeader>
        <TaskForm task={task} board={board} showBoardButton={showBoardButton} />
      </DialogContent>
    </Dialog>
  );
}
