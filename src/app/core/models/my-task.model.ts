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
  sp: number;
  dates?: {
    start: Date;
    end: Date;
  };
  assigneeId?: string;
  assigneeName?: string;
  taskTypeId?: string;
  columnId?: string;
  creationDate?: Date;
  updateDate?: Date;
  deleteDate?: Date;
}
