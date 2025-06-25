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

  login(
    email: string,
    password: string
  ): Observable<{ success: boolean; token?: string; error?: string }> {
    return this.http.post<{ success: boolean; token?: string; error?: string }>(
      'https://localhost:7087/api/auth/login',
      { email, password }
    );
  }

  // Подтверждение по смс
  confirmSms(
    verificationId: string,
    code: string
  ): Observable<{ success: boolean; token?: string; error?: string }> {
    return this.http.post<{ success: boolean; token?: string; error?: string }>(
      'https://localhost:7087/api/auth/confirm-sms',
      { verificationId, code }
    );
  }
}
