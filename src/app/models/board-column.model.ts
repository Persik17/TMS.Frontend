import { BoardTask } from './board-task.model';

export interface BoardColumn {
  id: string;
  title: string;
  color: string; // Цвет фона колонки
  tasks: BoardTask[];
  order: number;
}
