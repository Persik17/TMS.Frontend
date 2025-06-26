import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../environments/environment';

@Injectable({ providedIn: 'root' })
export class BoardService {
  private readonly baseUrl = environment.companyApi;

  constructor(private http: HttpClient) {}

  getFirstBoard(companyId: string): Observable<any | null> {
    return this.http
      .get<any[]>(`${this.baseUrl}/${companyId}/boards`)
      .pipe(
        map((list) => (Array.isArray(list) && list.length > 0 ? list[0] : null))
      );
  }

  createDefaultBoard(companyId: string): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/${companyId}/boards`, {
      name: 'Моя первая доска',
    });
  }
}
