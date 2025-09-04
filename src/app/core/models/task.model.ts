export interface Task {
  id: string;
  name: string;
  description: string;
  boardId: string;
  creatorId: string;
  creatorName: string;
  assigneeId: string | null;
  assigneeName: string;
  startDate?: string;
  endDate?: string;
  actualClosingDate?: string;
  storyPoints?: number;
  taskTypeId: string;
  priority?: number;
  severity?: number;
  parentTaskId?: string;
  columnId: string;
  creationDate: string;
  updateDate?: string;
  deleteDate?: string;
  boardName?: string;
}
