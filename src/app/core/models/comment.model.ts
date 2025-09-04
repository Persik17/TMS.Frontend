export interface Comment {
  id: string;
  text: string;
  taskId: string;
  authorId: string;
  authorName: string;
  creationDate: string;
  updateDate?: string | null;
  deleteDate?: string | null;
  user?: {
    id: string;
    name?: string;
    avatarUrl?: string;
  };
}
