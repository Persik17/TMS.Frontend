import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class CompanyService {
  private readonly baseUrl = environment.companyApi;

  constructor(private http: HttpClient) {}

  getCompany(id: string): Observable<CompanyViewModel> {
    return this.http.get<CompanyViewModel>(`${this.baseUrl}/${id}`);
  }

  getFirstCompany(): Observable<CompanyViewModel | null> {
    return this.http
      .get<CompanyViewModel[]>(this.baseUrl)
      .pipe(
        map((list) => (Array.isArray(list) && list.length > 0 ? list[0] : null))
      );
  }

  createDefaultCompany(): Observable<CompanyViewModel> {
    return this.http.post<CompanyViewModel>(this.baseUrl, {
      name: 'Моя компания',
    });
  }
}
