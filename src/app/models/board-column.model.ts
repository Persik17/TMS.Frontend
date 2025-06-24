import { Task } from './task.model';

// Расширение Task для использования в доске (drag'n'drop, анимации)
export type BoardTask = Task & { loading?: boolean };

export interface BoardColumn {
  id: string;
  title: string;
  color: string; // Цвет фона колонки
  tasks: BoardTask[];
  order: number;
}
