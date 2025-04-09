export type Assignee = {
  id: number
  email: string
  fullName: string
  avatarUrl: string
}

export type Issue = {
  id: number
  title: string
  boardName: string
  description: string
  priority: string
  status: string
  boardId: number
  assignee: Assignee
  assigneeId: number
}

export type Board = {
  id: number
  name: string
  description: string
  taskCount: number
}

export type Task = {
  id: number
  title: string
  description: string
  status: string
  priority: string
  assignee: Assignee
}
