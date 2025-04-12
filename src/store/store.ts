import { createStore, createEffect } from 'effector';
import { dbClient } from '@/services/dbClient';
import { Issue, Board, User, Task } from '@/types';

// Effects
export const fetchIssuesFx = createEffect(async () => {
  try {
    const data = await dbClient.getTasks();
    return data;
  } catch (error) {
    console.error('Error fetching issues:', error);
    throw error;
  }
});

export const fetchBoardsFx = createEffect(async () => {
  try {
    const data = await dbClient.getBoards();
    return data;
  } catch (error) {
    console.error('Error fetching boards:', error);
    throw error;
  }
});

export const fetchUsersFx = createEffect(async () => {
  try {
    const data = await dbClient.getUsers();
    return data;
  } catch (error) {
    console.log(error);
  }
});

export const fetchBoardTasksFx = createEffect(async (boardId: string) => {
  try {
    const data = await dbClient.getBoardTasks(boardId);
    return { boardId, tasks: data };
  } catch (error) {
    console.error('Error fetching board tasks:', error);
    throw error;
  }
});

// Stores
export const $issues = createStore<Issue[]>([]).on(fetchIssuesFx.doneData, (_, issues) => issues);
export const $users = createStore<User[]>([]).on(fetchUsersFx.doneData, (_, users) => users);
export const $boards = createStore<Board[]>([]).on(fetchBoardsFx.doneData, (_, boards) => boards);
export const $boardTasks = createStore<Record<string, Task[]>>({}).on(
  fetchBoardTasksFx.doneData,
  (state, result) => ({
    ...state,
    [result.boardId]: result.tasks,
  }),
);
