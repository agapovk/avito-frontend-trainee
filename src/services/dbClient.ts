import { Board, Issue, NewTask, Task, UpdatedTask, User } from '@/types';

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
  async getBoardTasks(boardId: string): Promise<Task[]> {
    const response = await fetch(`http://localhost:8080/api/v1/boards/${boardId}`);
    if (!response.ok) {
      throw new Error('Failed to fetch board tasks');
    }
    const { data } = await response.json();
    return data;
  },
  async getUsers(): Promise<User[]> {
    const response = await await fetch(`http://localhost:8080/api/v1/users`);
    if (!response.ok) {
      throw new Error('Failed to fetch users');
    }
    const { data } = await response.json();
    return data;
  },

  async createTask(task: NewTask): Promise<NewTask> {
    const response = await fetch('http://localhost:8080/api/v1/tasks/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(task),
    });
    if (!response.ok) {
      throw new Error('Failed to create task');
    }
    const { data } = await response.json();
    return data;
  },

  async updateTask(id: number, task: UpdatedTask): Promise<Task> {
    const response = await fetch(`http://localhost:8080/api/v1/tasks/update/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(task),
    });
    if (!response.ok) {
      throw new Error('Failed to create task');
    }
    const { data } = await response.json();
    return data;
  },
};
