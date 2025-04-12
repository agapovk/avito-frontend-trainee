import { useEffect, useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import StatusFilter from './StatusFilter';
import BoardFilter from './BoardFilter';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog';
import NewForm from './NewForm';
import { X } from 'lucide-react';
import { useUnit } from 'effector-react';
import { $issues, $boards, fetchIssuesFx, fetchBoardsFx } from '@/store/store';
import EditDialog from './IssuesDialog';

export default function Issues() {
  const issues = useUnit($issues);
  const boards = useUnit($boards);

  useEffect(() => {
    fetchBoardsFx();
    fetchIssuesFx();
  }, []);

  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);
  const [selectedBoards, setSelectedBoards] = useState<string[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchBoardsFx();
    fetchIssuesFx();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const filteredIssues = issues.filter((issue) => {
    const query = debouncedQuery.toLowerCase();
    const matchesSearch =
      issue.title.toLowerCase().includes(query) ||
      issue.assignee?.fullName?.toLowerCase().includes(query);
    const matchesStatus = selectedStatuses.length === 0 || selectedStatuses.includes(issue.status);
    const matchesBoard = selectedBoards.length === 0 || selectedBoards.includes(issue.boardName);

    return matchesSearch && matchesStatus && matchesBoard;
  });

  return (
    <>
      <section className="space-y-4">
        <div className="flex justify-between items-center">
          <div className="relative">
            <Input
              type="text"
              placeholder="Поиск"
              className="w-2xs"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSearchQuery('')}
                className="absolute h-6 w-6 top-1/2 -translate-y-1/2 right-2 z-50 rounded-full bg-white"
              >
                <X />
              </Button>
            )}
          </div>
          <div className="flex gap-4 items center">
            <StatusFilter
              selectedStatuses={selectedStatuses}
              setSelectedStatuses={setSelectedStatuses}
            />
            <BoardFilter
              boards={boards}
              selectedBoards={selectedBoards}
              setSelectedBoards={setSelectedBoards}
            />
          </div>
        </div>
        <ul className="space-y-4">
          {filteredIssues.map((task) => (
            <li key={task.id}>
              <EditDialog task={task} />
            </li>
          ))}
        </ul>
        <div className="flex justify-end">
          <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
            <DialogTrigger asChild>
              <Button>Создать задачу</Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl">
              <DialogHeader>
                <DialogTitle>{'Создание задачи'}</DialogTitle>
                <DialogDescription>Заполните форму</DialogDescription>
              </DialogHeader>
              <NewForm setIsModalOpen={setIsModalOpen} />
            </DialogContent>
          </Dialog>
        </div>
      </section>
    </>
  );
}
