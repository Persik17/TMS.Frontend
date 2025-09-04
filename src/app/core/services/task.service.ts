import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { Task } from '../models/task.model';
import { Comment } from '../models/comment.model';
import { MyTask } from '../models/my-task.model';
import { TaskFile } from '../models/task-file.model';

export type TaskCreateDto = {
  name: string;
  boardId: string;
  creatorId: string;
  assigneeId: string;
  taskTypeId: string;
  columnId: string;
};

export interface TaskUpdateDto {
  id: string;
  name: string;
  description?: string;
  assigneeId?: string;
  storyPoints?: number;
  priority?: number;
  severity?: number;
}

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
    update: TaskUpdateDto,
    userId: string
  ): Observable<TaskUpdateDto> {
    return this.http.put<TaskUpdateDto>(
      `${this.baseUrl}/${id}?userId=${userId}`,
      update
    );
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

  getMyTasks(userId: string): Observable<MyTask[]> {
    return this.http.get<MyTask[]>(`${this.baseUrl}/my?userId=${userId}`);
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

  moveTaskToColumn(
    taskId: string,
    columnId: string,
    userId: string
  ): Observable<void> {
    return this.http.post<void>(
      `${this.baseUrl}/${taskId}/move?columnId=${columnId}&userId=${userId}`,
      null
    );
  }

  getTaskFiles(taskId: string, userId: string): Observable<TaskFile[]> {
    return this.http
      .get<TaskFile[]>(`${this.baseUrl}/${taskId}/files?userId=${userId}`)
      .pipe(
        map((files) =>
          files.map((file) => ({
            ...file,
            url: `${this.baseUrl}/${taskId}/files/${file.id}/download?userId=${userId}`,
          }))
        )
      );
  }

  downloadTaskFile(
    taskId: string,
    fileId: string,
    userId: string
  ): Observable<Blob> {
    return this.http.get(
      `${this.baseUrl}/${taskId}/files/${fileId}/download?userId=${userId}`,
      { responseType: 'blob' }
    );
  }

  uploadTaskFile(
    taskId: string,
    file: File,
    userId: string
  ): Observable<TaskFile> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('userId', userId);
    return this.http.post<TaskFile>(
      `${this.baseUrl}/${taskId}/files/upload`,
      formData
    );
  }

  deleteTaskFile(
    taskId: string,
    fileId: string,
    userId: string
  ): Observable<void> {
    return this.http.delete<void>(
      `${this.baseUrl}/${taskId}/files/${fileId}?userId=${userId}`
    );
  }
}
