import { BoardTask } from "./board-task.model";

export type BoardColumn = {
  id: string;
  title: string;
  color: string;
  order: number;
  tasks: BoardTask[];
};
