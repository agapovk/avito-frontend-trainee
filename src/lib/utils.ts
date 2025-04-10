import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const statusMap = {
  Backlog: {
    order: 1,
    title: 'To do',
    border: 'border-l-blue-400',
  },
  InProgress: {
    order: 2,
    title: 'In progress',
    border: 'border-l-yellow-400',
  },
  Done: {
    order: 3,
    title: 'Done',
    border: 'border-l-emerald-400',
  },
};
