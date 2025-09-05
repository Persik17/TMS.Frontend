export type MyTaskStatus = 'open' | 'done';
export type MyTaskPriority = 'low' | 'medium' | 'high';

export interface MyTask {
  id: string;
  title: string;
  description?: string;
  boardId: string;
  boardName: string;
  status: MyTaskStatus;
  priority: MyTaskPriority;
  sp: number | string;
  dates?: {
    start: Date | null;
    end: Date | null;
  };
  assigneeId?: string;
  assigneeName?: string;
  taskTypeId?: string;
  columnId?: string;
  creationDate?: Date | null;
  updateDate?: Date | null;
  deleteDate?: Date | null;
}
