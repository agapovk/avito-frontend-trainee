import { useEffect, useState, useMemo, useCallback, memo } from 'react';
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
import { ArrowUp } from 'lucide-react'; // Add this import
import { useDebounce } from '@/hooks/useDebounce';

const MemoizedStatusFilter = memo(StatusFilter);
const MemoizedBoardFilter = memo(BoardFilter);
const MemoizedEditDialog = memo(EditDialog);

export default function Issues() {
  const issues = useUnit($issues);
  const boards = useUnit($boards);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);
  const [selectedBoards, setSelectedBoards] = useState<string[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const debouncedQuery = useDebounce(searchQuery, 300);

  useEffect(() => {
    fetchBoardsFx();
    fetchIssuesFx();
  }, []);

  // Memoize filtered results
  const filteredIssues = useMemo(() => {
    return issues.filter((issue) => {
      const query = debouncedQuery.toLowerCase();
      const matchesSearch =
        issue.title.toLowerCase().includes(query) ||
        issue.assignee?.fullName?.toLowerCase().includes(query);
      const matchesStatus =
        selectedStatuses.length === 0 || selectedStatuses.includes(issue.status);
      const matchesBoard = selectedBoards.length === 0 || selectedBoards.includes(issue.boardName);
      return matchesSearch && matchesStatus && matchesBoard;
    });
  }, [issues, debouncedQuery, selectedStatuses, selectedBoards]);

  // Add scroll handler
  const scrollToTop = useCallback(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  }, []);

  // Add scroll event listener
  useEffect(() => {
    const toggleVisibility = () => setIsVisible(window.scrollY > 300);

    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  return (
    <>
      <section className="space-y-4 mx-auto max-w-2xl">
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
            <MemoizedStatusFilter
              selectedStatuses={selectedStatuses}
              setSelectedStatuses={setSelectedStatuses}
            />
            <MemoizedBoardFilter
              boards={boards}
              selectedBoards={selectedBoards}
              setSelectedBoards={setSelectedBoards}
            />
          </div>
        </div>
        <ul className="space-y-4">
          {filteredIssues.map((task) => (
            <li key={task.id}>
              <MemoizedEditDialog task={task} />
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

      {/* Add floating button */}
      {isVisible && (
        <Button
          onClick={scrollToTop}
          size="icon"
          className="fixed bottom-4 right-4 rounded-full shadow-lg transition-opacity opacity-90 hover:opacity-100"
        >
          <ArrowUp className="h-4 w-4" />
        </Button>
      )}
    </>
  );
}
