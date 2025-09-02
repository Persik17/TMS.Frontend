import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';

export interface TaskType {
  id: string;
  name: string;
  description?: string;
  color: string;
  creationDate?: string;
  updateDate?: string;
  deleteDate?: string;
}

@Injectable({ providedIn: 'root' })
export class TaskTypeService {
  private readonly baseUrl = `${environment.apiBaseUrl}/tasktype`;

  constructor(private http: HttpClient) {}

  getTaskTypesByBoardId(
    boardId: string,
    userId: string
  ): Observable<TaskType[]> {
    return this.http.get<TaskType[]>(
      `${this.baseUrl}/by-board/${boardId}?userId=${userId}`
    );
  }
}
