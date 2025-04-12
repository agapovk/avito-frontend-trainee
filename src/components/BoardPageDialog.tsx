import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog';
import EditForm from './EditForm';
import { Board, Task } from '@/types';
import { Button } from './ui/button';
import { cn, statusMap } from '@/lib/utils';

export default function BoardPageDialog({ task, board }: { task: Task; board: Board }) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
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
        <EditForm
          task={task}
          board={board}
          disableBoardField={true}
          setIsEditModalOpen={setIsModalOpen}
        />
      </DialogContent>
    </Dialog>
  );
}
