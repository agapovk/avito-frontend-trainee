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
import React from 'react';

export default function BoardFilter({
  boards,
  selectedBoards,
  setSelectedBoards,
}: {
  boards: Board[];
  selectedBoards: string[];
  setSelectedBoards: React.Dispatch<React.SetStateAction<string[]>>;
}) {
  const handleSelect = (boardName: string) => {
    setSelectedBoards((prev) =>
      prev.includes(boardName) ? prev.filter((s) => s !== boardName) : [...prev, boardName],
    );
  };

  if (boards.length === 0) {
    return null;
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className={cn('h-8', selectedBoards.length > 0 && 'border-primary text-primary')}
        >
          <CalendarSearch className="h-4 w-4" />
          Доска
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-fit p-0" align="end">
        <Command>
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup>
              {boards.map(({ id, name }) => {
                const isSelected = selectedBoards.includes(name);
                return (
                  <CommandItem key={id} onSelect={() => handleSelect(name)}>
                    <div
                      className={cn(
                        'mr-2 flex h-4 w-4 items-center justify-center rounded-sm border',
                        isSelected ? 'bg-primary' : 'opacity-75 [&_svg]:invisible',
                      )}
                    >
                      <Check className="text-white" />
                    </div>
                    {name}
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
