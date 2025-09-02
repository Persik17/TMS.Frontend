export type BoardTask = {
  id: string;
  name: string;
  description?: string | null;
  boardId: string;
  priority?: number | null;
  storyPoints?: number | null;
  startDate?: string | null;
  endDate?: string | null;
  creatorId: string;
  assigneeId?: string | null;
  taskTypeId: string;
  columnId: string;
  loading?: boolean;
};
