export interface TaskFile {
  id: string;
  taskId: string;
  fileName: string;
  contentType: string;
  size?: number;
  creationDate: string;
  url?: string;
}
