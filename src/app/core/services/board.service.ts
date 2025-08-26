import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../environments/environment';
import { BoardStub } from '../models/board.model';
import { BoardColumn } from '../models/board-column.model';

export interface BoardTaskType {
  id: string;
  name: string;
  color: string;
}

export interface BoardInfoDto {
  boardId: string;
  columns: BoardColumn[];
  taskTypes: BoardTaskType[];
}

@Injectable({ providedIn: 'root' })
export class BoardService {
  private readonly baseUrl = environment.companyApi;

  constructor(private http: HttpClient) {}

  getBoards(companyId: string): Observable<BoardStub[]> {
    const userId = localStorage.getItem('userId');
    return this.http.get<BoardStub[]>(
      `${this.baseUrl}/${companyId}/boards?userId=${userId}`
    );
  }

  getFirstBoard(companyId: string): Observable<BoardStub | null> {
    return this.getBoards(companyId).pipe(
      map((list) => (Array.isArray(list) && list.length > 0 ? list[0] : null))
    );
  }

  createBoard(
    companyId: string,
    name: string,
    privacy: 'private' | 'public'
  ): Observable<BoardStub> {
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
    return this.http.post<BoardStub>(
      `${this.baseUrl}/${companyId}/boards?userId=${userId}`,
      body
    );
  }

  getBoardInfo(companyId: string, boardId: string): Observable<BoardInfoDto> {
    const userId = localStorage.getItem('userId');
    return this.http.get<BoardInfoDto>(
      `${this.baseUrl}/${companyId}/boards/${boardId}/info?userId=${userId}`
    );
  }
}
