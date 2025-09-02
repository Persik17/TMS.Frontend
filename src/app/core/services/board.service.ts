import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../environments/environment';
import { Board } from '../models/board.model';
import { BoardColumn } from '../models/board-column.model';

export type BoardTaskType = {
  id: string;
  name: string;
  description?: string;
  color: string;
  creationDate?: string;
  updateDate?: string;
  deleteDate?: string;
};

export interface BoardInfoDto {
  boardId: string;
  columns: BoardColumn[];
  taskTypes: BoardTaskType[];
}

export interface TaskCreateDto {
  name: string;
  description: string;
  boardId: string;
  creatorId: string;
  assigneeId: string;
  startDate: string;
  endDate: string | null;
  storyPoints: number;
  taskTypeId: string;
  priority: number;
  severity: number;
  parentTaskId?: string | null;
  columnId: string;
}

@Injectable({ providedIn: 'root' })
export class BoardService {
  private readonly baseUrl = environment.companyApi;

  constructor(private http: HttpClient) {}

  getBoards(companyId: string): Observable<Board[]> {
    const userId = localStorage.getItem('userId');
    return this.http.get<Board[]>(
      `${this.baseUrl}/${companyId}/boards?userId=${userId}`
    );
  }

  updateBoard(companyId: string, board: Partial<Board>): Observable<Board> {
    const userId = localStorage.getItem('userId');
    return this.http.put<Board>(
      `${this.baseUrl}/${companyId}/boards/${board.id}?userId=${userId}`,
      board
    );
  }

  getFirstBoard(companyId: string): Observable<Board | null> {
    return this.getBoards(companyId).pipe(
      map((list) => (Array.isArray(list) && list.length > 0 ? list[0] : null))
    );
  }

  createBoard(
    companyId: string,
    name: string,
    privacy: 'private' | 'public'
  ): Observable<Board> {
    const body = {
      name,
      description: '',
      companyId,
      boardType: 0,
      isPrivate: privacy === 'private',
      creationDate: new Date().toISOString(),
      headFullName: '',
    };
    const userId = localStorage.getItem('userId');
    return this.http.post<Board>(
      `${this.baseUrl}/${companyId}/boards?userId=${userId}`,
      body
    );
  }

  deleteBoard(companyId: string, boardId: string): Observable<void> {
    const userId = localStorage.getItem('userId');
    return this.http.delete<void>(
      `${this.baseUrl}/${companyId}/boards/${boardId}?userId=${userId}`
    );
  }

  getBoardInfo(companyId: string, boardId: string): Observable<BoardInfoDto> {
    const userId = localStorage.getItem('userId');
    return this.http.get<BoardInfoDto>(
      `${this.baseUrl}/${companyId}/boards/${boardId}/info?userId=${userId}`
    );
  }

  addColumn(
    companyId: string,
    boardId: string,
    title: string,
    description: string,
    order: number,
    color?: string
  ): Observable<BoardColumn> {
    const userId = localStorage.getItem('userId');
    const body = {
      name: title,
      description: description,
      order,
      color: color ?? '#e3f2fd',
    };
    return this.http.post<BoardColumn>(
      `${this.baseUrl}/${companyId}/boards/${boardId}/columns?userId=${userId}`,
      body
    );
  }

  updateColumn(
    companyId: string,
    boardId: string,
    column: BoardColumn
  ): Observable<BoardColumn> {
    const userId = localStorage.getItem('userId');
    const body = {
      id: column.id,
      name: column.title,
      description: column.description,
      order: column.order,
      color: column.color ?? '#e3f2fd',
      boardId: boardId,
    };
    return this.http.put<BoardColumn>(
      `${this.baseUrl}/${companyId}/boards/${boardId}/columns/${column.id}?userId=${userId}`,
      body
    );
  }

  deleteColumn(
    companyId: string,
    boardId: string,
    columnId: string
  ): Observable<void> {
    const userId = localStorage.getItem('userId');
    return this.http.delete<void>(
      `${this.baseUrl}/${companyId}/boards/${boardId}/columns/${columnId}?userId=${userId}`
    );
  }
}
