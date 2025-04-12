import { CalendarSearch, Check } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { cn } from '@/lib/utils';
import { Button } from './ui/button';
import { Board } from '@/types';

export default function BoardFilter({
  boards,
  selectedBoards,
  setSelectedBoards,
}: {
  boards: Board[];
  selectedBoards: string[];
  setSelectedBoards: React.Dispatch<React.SetStateAction<string[]>>;
}) {
  if (!boards) return null;
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="h-8">
          <CalendarSearch className="h-4 w-4" />
          Доска
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-fit p-0" align="end">
        <Command>
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup>
              {boards.map((board) => {
                const isSelected = selectedBoards.includes(board.name);
                return (
                  <CommandItem
                    key={board.id}
                    onSelect={() => {
                      setSelectedBoards((prev) =>
                        isSelected ? prev.filter((s) => s !== board.name) : [...prev, board.name],
                      );
                    }}
                  >
                    <div
                      className={cn(
                        'mr-2 flex h-4 w-4 items-center justify-center rounded-sm border',
                        isSelected ? 'bg-primary' : 'opacity-75 [&_svg]:invisible',
                      )}
                    >
                      <Check className="text-white" />
                    </div>
                    {board.name}
                  </CommandItem>
                );
              })}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
