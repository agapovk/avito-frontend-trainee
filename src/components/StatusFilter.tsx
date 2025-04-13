import { Check, ListFilter } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { cn, statusMap } from '@/lib/utils';
import { Button } from './ui/button';
import React, { useCallback } from 'react';

export default function StatusFilter({
  selectedStatuses,
  setSelectedStatuses,
}: {
  selectedStatuses: string[];
  setSelectedStatuses: React.Dispatch<React.SetStateAction<string[]>>;
}) {
  const handleSelect = useCallback(
    (status: string) => {
      setSelectedStatuses((prev) =>
        prev.includes(status) ? prev.filter((s) => s !== status) : [...prev, status],
      );
    },
    [setSelectedStatuses],
  );

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className={cn('h-8', selectedStatuses.length > 0 && 'border-primary text-primary')}
        >
          <ListFilter className="h-4 w-4 mr-2" />
          Статус
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-fit p-0" align="end">
        <Command>
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup>
              {Object.entries(statusMap).map(([status, { title }]) => {
                const isSelected = selectedStatuses.includes(status);
                return (
                  <CommandItem key={status} onSelect={() => handleSelect(status)}>
                    <div
                      className={cn(
                        'mr-2 flex h-4 w-4 items-center justify-center rounded-sm border',
                        isSelected ? 'bg-primary' : 'opacity-75 [&_svg]:invisible',
                      )}
                    >
                      <Check className="text-white" />
                    </div>
                    {title}
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
