import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Task } from '../models/task.model';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class TaskService {
  private readonly baseUrl = `${environment.apiBaseUrl}/tasks`;

  private demoTask: Task = {
    id: '1',
    name: 'Сделать дизайн',
    description: 'Подготовить макеты для главной страницы.',
    boardId: 'board1',
    creatorId: 'user1',
    assigneeId: 'user2',
    startDate: '2025-06-20T10:00:00Z',
    endDate: '2025-06-25T18:00:00Z',
    actualClosingDate: null,
    storyPoints: 5,
    taskTypeId: 'type1',
    priority: 2,
    severity: 1,
    parentTaskId: null,
    columnId: 'todo',
    creationDate: '2025-06-19T15:00:00Z',
    updateDate: '2025-06-19T15:00:00Z',
    deleteDate: null,
  };

  // constructor(private http: HttpClient) {}
  getTask(boardId: string, taskId: string): Observable<Task> {
    // return this.http.get<Task>(`${this.baseUrl}/${boardId}/${taskId}`);
    return of(this.demoTask);
  }
}
