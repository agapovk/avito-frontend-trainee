import { Board, Issue, Task } from '@/types';

export const dbClient = {
  async getTasks(): Promise<Issue[]> {
    const response = await fetch('http://localhost:8080/api/v1/tasks');
    if (!response.ok) {
      throw new Error('Failed to fetch tasks');
    }
    const { data } = await response.json();
    return data;
  },
  async getBoards(): Promise<Board[]> {
    const response = await fetch('http://localhost:8080/api/v1/boards');
    if (!response.ok) {
      throw new Error('Failed to fetch boards');
    }
    const { data } = await response.json();
    return data;
  },
  async getBoard(boardId: string): Promise<Board> {
    const response = await fetch(`http://localhost:8080/api/v1/boards/${boardId}`);
    if (!response.ok) {
      throw new Error('Failed to fetch board');
    }
    const { data } = await response.json();
    return data;
  },
  async getBoardTasks(boardId: string): Promise<Task[]> {
    const response = await fetch(`http://localhost:8080/api/v1/boards/${boardId}`);
    if (!response.ok) {
      throw new Error('Failed to fetch board tasks');
    }
    const { data } = await response.json();
    return data;
  },
};
