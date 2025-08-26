import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../environments/environment';
import { CompanyViewModel } from './../../core/models/company.model';

@Injectable({ providedIn: 'root' })
export class CompanyService {
  private readonly baseUrl = environment.companyInfoApi;

  constructor(private http: HttpClient) {}

  getCompany(userId: string): Observable<CompanyViewModel> {
    const url = `${this.baseUrl}`;
    console.log(userId);
    console.log(url);
    return this.http.get<CompanyViewModel>(url, { params: { userId } });
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
