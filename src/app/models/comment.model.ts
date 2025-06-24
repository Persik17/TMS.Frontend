export interface Comment {
  id: string;
  creationDate: string;
  updateDate?: string | null;
  deleteDate?: string | null;
  text: string;
  userId: string;
  user: { id: string; name: string; avatarUrl?: string };
  taskId: string;
}
