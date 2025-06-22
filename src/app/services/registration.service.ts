import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface RegistrationResultViewModel {
  success: boolean;
  verificationId?: string;
  expiration?: string;
  error?: string;
}

@Injectable({ providedIn: 'root' })
export class RegistrationService {
  private readonly apiUrl = 'https://localhost:7087/api/register';

  constructor(private http: HttpClient) {}

  register(email: string, password: string): Observable<RegistrationResultViewModel> {
    const data = {
      target: email,
      type: 1,
      password: password
    };
    return this.http.post<RegistrationResultViewModel>(this.apiUrl, data);
  }
}
