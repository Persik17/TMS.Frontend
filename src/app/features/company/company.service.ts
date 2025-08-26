import { CompanyViewModel } from './company.model';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class CompanyService {
  private baseUrl = '/api/Company';

  constructor(private http: HttpClient) {}

  getCompany(id: string): Observable<CompanyViewModel> {
    const url = `${this.baseUrl}/${id}`;
    return this.http.get<CompanyViewModel>(url);
  }
}
