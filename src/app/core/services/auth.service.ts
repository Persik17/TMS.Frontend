import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { AuthenticationResultViewModel } from '../models/authentication-result.model';

export type AuthResult$ = Observable<AuthenticationResultViewModel>;

export interface TelegramAuthViewModel {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  photo_url?: string;
  auth_date: number;
  hash: string;
}

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

    loginViaTelegram(user: TelegramAuthViewModel): Observable<AuthenticationResultViewModel> {
    return this.http.post<AuthenticationResultViewModel>(
      `${this.apiUrl}/telegram`,
      user
    );
  }

  confirmSms(verificationId: string, code: string): AuthResult$ {
    return this.http.post<AuthenticationResultViewModel>(
      `${this.apiUrl}/confirm-sms`,
      { verificationId, code }
    );
  }
}
