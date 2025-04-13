import { createStore, createDomain } from 'effector';
import { dbClient } from '@/services/dbClient';
import { Issue, Board, User, Task } from '@/types';

// Create domains for logical separation
const appDomain = createDomain();
const boardDomain = createDomain();
const userDomain = createDomain();

// Effects
export const fetchIssuesFx = appDomain.createEffect(async () => {
  try {
    const data = await dbClient.getTasks();
    return data;
  } catch (error) {
    console.error('Error fetching issues:', error);
    throw error;
  }
});

export const fetchBoardsFx = boardDomain.createEffect(async () => {
  try {
    const data = await dbClient.getBoards();
    return data;
  } catch (error) {
    console.error('Error fetching boards:', error);
    throw error;
  }
});

export const fetchUsersFx = userDomain.createEffect(async () => {
  try {
    const data = await dbClient.getUsers();
    return data;
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
});

export const fetchBoardTasksFx = boardDomain.createEffect(async (boardId: string) => {
  try {
    const data = await dbClient.getBoardTasks(boardId);
    return { boardId, tasks: data };
  } catch (error) {
    console.error('Error fetching board tasks:', error);
    throw error;
  }
});

// Utility for deep equality check
const isEqual = <T>(a: T, b: T) => JSON.stringify(a) === JSON.stringify(b);

// Stores with deep equality checks
export const $issues = createStore<Issue[]>([]).on(fetchIssuesFx.doneData, (prev, next) =>
  isEqual(prev, next) ? prev : next,
);

export const $boards = createStore<Board[]>([]).on(fetchBoardsFx.doneData, (prev, next) =>
  isEqual(prev, next) ? prev : next,
);

export const $users = createStore<User[]>([]).on(fetchUsersFx.doneData, (prev, next) =>
  isEqual(prev, next) ? prev : next,
);

export const $boardTasks = createStore<Record<string, Task[]>>({}).on(
  fetchBoardTasksFx.doneData,
  (state, result) => {
    const currentTasks = state[result.boardId] || [];
    return isEqual(currentTasks, result.tasks)
      ? state
      : { ...state, [result.boardId]: result.tasks };
  },
);

// Unified error handling
const handleError = (error: Error) => {
  console.error('API Error:', error);
};

[fetchIssuesFx, fetchBoardsFx, fetchUsersFx, fetchBoardTasksFx].forEach((effect) => {
  effect.fail.watch(({ error }) => handleError(error));
});
