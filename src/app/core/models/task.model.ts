export interface Task {
  id: string;
  name: string;
  description?: string | null;
  boardId: string;
  creatorId: string;
  creatorName?: string | null;
  assigneeId?: string | null;
  assigneeName?: string | null;
  startDate?: string | null;
  endDate?: string | null;
  actualClosingDate?: string | null;
  storyPoints?: number | null;
  taskTypeId: string;
  priority?: number | null;
  severity?: number | null;
  parentTaskId?: string | null;
  columnId: string;
  creationDate: string;
  updateDate?: string | null;
  deleteDate?: string | null;
}
