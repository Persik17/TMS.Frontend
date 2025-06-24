export interface TaskFilter {
  title?: string;
  assignee?: string;
  priority?: 'low' | 'medium' | 'high' | '';
  status?: 'todo' | 'in-progress' | 'done' | '';
}
