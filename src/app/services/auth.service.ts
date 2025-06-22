import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface AuthenticationResultViewModel {
  success: boolean;
  token?: string;
  error?: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly apiUrl = 'https://localhost:7087/api/login';

  constructor(private http: HttpClient) {}

  login(email: string, password: string): Observable<AuthenticationResultViewModel> {
    return this.http.post<AuthenticationResultViewModel>(
      `${this.apiUrl}/login`,
      { email, password }
    );
  }
}
