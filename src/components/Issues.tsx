import { useCallback, useEffect, useState } from 'react';
import { Board, Issue } from '../types';
import { Button } from './ui/button';
import { Input } from './ui/input';
import IssueCard from './IssueCard';
import { dbClient } from '@/services/dbClient';
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
import EditForm from './EditForm';
import NewForm from './NewForm';
import { X } from 'lucide-react';

export default function Issues() {
  const [issues, setIssues] = useState<Issue[]>([]);
  const [boards, setBoards] = useState<Board[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);
  const [selectedBoards, setSelectedBoards] = useState<string[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchIssues = useCallback(async () => {
    try {
      const data = await dbClient.getTasks();
      setIssues(data);
    } catch (error) {
      console.error(error);
    }
  }, []);

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
    fetchIssues();
  }, [fetchBoards, fetchIssues]);

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
              <Dialog>
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
                    board={boards.find(
                      (b) => b.name.toLowerCase() === task.boardName.toLowerCase(),
                    )}
                    showBoardButton={true}
                  />
                </DialogContent>
              </Dialog>
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
              <NewForm setIsModalOpen={setIsModalOpen} fetchIssues={fetchIssues} />
            </DialogContent>
          </Dialog>
        </div>
      </section>
    </>
  );
}
