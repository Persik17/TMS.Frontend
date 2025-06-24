export interface Task {
  id: string;
  title: string;
  assignee: string;
  priority: 'low' | 'medium' | 'high';
  status: 'todo' | 'in-progress' | 'done';
  loading?: boolean;
}

export interface BoardColumn {
  id: string;
  title: string;
  tasks: Task[];
}
