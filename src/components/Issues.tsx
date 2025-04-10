import { useCallback, useEffect, useState } from 'react';
import { Board, Issue } from '../types';
import { Button } from './ui/button';
import { Input } from './ui/input';
import IssueCard from './IssueCard';
import { dbClient } from '@/services/dbclient';
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
import TaskForm from './TaskForm';

export default function Issues() {
  const [issues, setIssues] = useState<Issue[]>([]);
  const [boards, setBoards] = useState<Board[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);
  const [selectedBoards, setSelectedBoards] = useState<string[]>([]);

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

  useEffect(() => {}, []);

  useEffect(() => {
    fetchBoards();
    fetchIssues();
  }, []);

  return (
    <>
      <section className="space-y-4">
        <div className="flex justify-between items-center">
          <Input
            type="text"
            placeholder="Поиск"
            className="w-2xs"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
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
                    <DialogTitle>{task ? 'Редактирование задачи' : 'Создание задачи'}</DialogTitle>
                    <DialogDescription>Заполните форму</DialogDescription>
                  </DialogHeader>
                  <TaskForm
                    task={task}
                    showBoardButton={true}
                    board={boards.find(
                      (b) => b.name.toLowerCase() === task.boardName.toLowerCase(),
                    )}
                  />
                </DialogContent>
              </Dialog>
            </li>
          ))}
        </ul>
        <div className="flex justify-end">
          <Button className="">Создать задачу</Button>
        </div>
      </section>
    </>
  );
}
