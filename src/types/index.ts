export type Assignee = {
  id: number;
  email: string;
  fullName: string;
  avatarUrl: string;
};

// export type Issue = {
//   id: number;
//   title: string;
//   description: string;
//   priority: string;
//   status: string;
//   boardName: string;
//   boardId: number;
//   assignee: Assignee;
//   assigneeId: number;
// };

// export type Task = {
//   id: number;
//   title: string;
//   description: string;
//   status: string;
//   priority: string;
//   assignee: Assignee;
// };

export type BaseTask = {
  id: number;
  title: string;
  description: string;
  status: string;
  priority: string;
  assignee: Assignee;
};

export type Issue = BaseTask & {
  boardName: string;
  boardId: number;
  assigneeId: number;
};

export type Task = BaseTask;

export type TaskOrIssue = Task | Issue;

export type Board = {
  id: number;
  name: string;
  description: string;
  taskCount: number;
};

export type NewTask = {
  assigneeId: number;
  boardId: number;
  description: string;
  priority: string;
  title: string;
};

export type UpdatedTask = {
  assigneeId: number;
  description: string;
  priority: string;
  status: string;
  title: string;
};

export type User = {
  id: number;
  email: string;
  fullName: string;
  description: string;
  avatarUrl: string;
  teamName: string;
  teamId: number;
  tasksCount: number;
};
