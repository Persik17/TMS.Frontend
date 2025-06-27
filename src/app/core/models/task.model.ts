export interface Task {
  id: string;
  name: string;
  description: string;
  boardId: string;
  creatorId: string;
  assigneeId: string;
  startDate: string | null;
  endDate: string | null;
  actualClosingDate?: string | null;
  storyPoints: number;
  taskTypeId: string;
  priority: number;
  severity: number;
  parentTaskId?: string | null;
  columnId: string;
  creationDate: string;
  updateDate?: string | null;
  deleteDate?: string | null;
}
