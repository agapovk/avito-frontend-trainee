import { useState } from 'react';
import IssueCard from './IssueCard';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog';
import EditForm from './EditForm';
import { useUnit } from 'effector-react';
import { $boards, fetchIssuesFx } from '@/store/store';
import { Issue } from '@/types';

export default function EditDialog({ task }: { task: Issue }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const boards = useUnit($boards);
  return (
    <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
      <DialogTrigger asChild>
        <div className="cursor-pointer">
          <IssueCard issue={task} />
        </div>
      </DialogTrigger>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>Редактирование задачи</DialogTitle>
          <DialogDescription>Заполните форму</DialogDescription>
        </DialogHeader>
        <EditForm
          task={task}
          board={boards.find((b) => b.name.toLowerCase() === task.boardName.toLowerCase())}
          showBoardButton={true}
          setIsEditModalOpen={setIsModalOpen}
          fetchAction={fetchIssuesFx}
        />
      </DialogContent>
    </Dialog>
  );
}
