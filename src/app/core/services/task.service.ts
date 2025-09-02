import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Task } from '../models/task.model';
import { Comment } from '../models/comment.model';

export type TaskCreateDto = {
  name: string;
  boardId: string;
  creatorId: string;
  assigneeId: string;
  taskTypeId: string;
  columnId: string;
};

export interface TaskDto extends TaskCreateDto {
  id: string;
  description?: string;
  startDate?: string | null;
  endDate?: string | null;
  actualClosingDate?: string | null;
  storyPoints?: number | null;
  priority?: number | null;
  severity?: number | null;
  parentTaskId?: string | null;
  creationDate?: string;
  updateDate?: string | null;
  deleteDate?: string | null;
}

export interface CommentDto {
  id?: string;
  text: string;
  taskId?: string;
  authorId: string;
  creationDate?: string;
  updateDate?: string | null;
  deleteDate?: string | null;
}

@Injectable({ providedIn: 'root' })
export class TaskService {
  private readonly baseUrl = `${environment.apiBaseUrl}/task`;

  constructor(private http: HttpClient) {}

  getTask(id: string, userId: string): Observable<Task> {
    return this.http.get<Task>(`${this.baseUrl}/${id}?userId=${userId}`);
  }

  createTask(task: TaskCreateDto, userId: string): Observable<Task> {
    return this.http.post<Task>(`${this.baseUrl}?userId=${userId}`, task);
  }

  updateTask(
    id: string,
    task: Partial<Task>,
    userId: string
  ): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/${id}?userId=${userId}`, task);
  }

  deleteTask(id: string, userId: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}?userId=${userId}`);
  }

  addComment(taskId: string, comment: CommentDto): Observable<Comment> {
    return this.http.post<Comment>(
      `${this.baseUrl}/${taskId}/comments`,
      comment
    );
  }

  getComments(taskId: string, userId: string): Observable<Comment[]> {
    return this.http.get<Comment[]>(
      `${this.baseUrl}/${taskId}/comments?userId=${userId}`
    );
  }

  updateComment(
    taskId: string,
    commentId: string,
    comment: CommentDto
  ): Observable<Comment> {
    return this.http.put<Comment>(
      `${this.baseUrl}/${taskId}/comments/${commentId}`,
      comment
    );
  }

  deleteComment(
    taskId: string,
    commentId: string,
    userId: string
  ): Observable<void> {
    return this.http.delete<void>(
      `${this.baseUrl}/${taskId}/comments/${commentId}?userId=${userId}`
    );
  }
}
