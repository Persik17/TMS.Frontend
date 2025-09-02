import { BoardTask } from './board-task.model';

export interface BoardColumn {
  id: string;
  title: string;
  description: string;
  color: string;
  order: number;
  tasks: BoardTask[];
}
