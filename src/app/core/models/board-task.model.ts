export type BoardTask = {
  comments: any[];
  changeHistory: any[];
  attachedFiles: any[];
  id: string;
  name: string;
  description: string;
  assigneeId: string;
  startDate: string;
  endDate: string | null;
  storyPoints: number;
  priority: number;
  columnId: string;
  loading: boolean;
};
