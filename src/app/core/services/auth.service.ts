import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface AuthenticationResultViewModel {
  success: boolean;
  token?: string;
  error?: string;
}

export type AuthResult$ = Observable<AuthenticationResultViewModel>;

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly apiUrl = environment.authApi;

  constructor(private http: HttpClient) {}

  login(email: string, password: string): AuthResult$ {
    return this.http.post<AuthenticationResultViewModel>(
      `${this.apiUrl}/login`,
      { email, password }
    );
  }

  confirmSms(verificationId: string, code: string): AuthResult$ {
    return this.http.post<AuthenticationResultViewModel>(
      `${this.apiUrl}/confirm-sms`,
      { verificationId, code }
    );
  }
}
