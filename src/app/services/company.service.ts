import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface CompanyViewModel {
  id: string;
  name: string;
  inn: string;
  ogrn: string;
  address: string;
  logo: string;
  website: string;
  industry: string;
  description: string;
  isActive: string;
  contactEmail: string;
  contactPhone: string;
}

@Injectable({ providedIn: 'root' })
export class CompanyService {
  private readonly apiUrl = 'https://localhost:7087/api/company';

  constructor(private http: HttpClient) {}

  getCompany(id: string): Observable<CompanyViewModel> {
    return this.http.get<CompanyViewModel>(`${this.apiUrl}/${id}`);
  }
}
