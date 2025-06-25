import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class ApiService {
  constructor(private http: HttpClient) {}

  getFirstCompany(): Promise<any | null> {
    return this.http
      .get<any[]>('https://localhost:7087/api/companies')
      .toPromise()
      .then((list) =>
        Array.isArray(list) && list.length > 0 ? list[0] : null
      );
  }

  createDefaultCompany(): Promise<any> {
    return this.http
      .post('https://localhost:7087/api/companies', { name: 'Моя компания' })
      .toPromise();
  }

  getFirstBoard(companyId: string): Promise<any | null> {
    return this.http
      .get<any[]>(`https://localhost:7087/api/companies/${companyId}/boards`)
      .toPromise()
      .then((list) =>
        Array.isArray(list) && list.length > 0 ? list[0] : null
      );
  }

  createDefaultBoard(companyId: string): Promise<any> {
    return this.http
      .post(`https://localhost:7087/api/companies/${companyId}/boards`, {
        name: 'Моя первая доска',
      })
      .toPromise();
  }
}
