import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RegistrationResultViewModel } from '../models/registration-result.model';
import { AuthenticationResultViewModel } from '../models/authentication-result.model';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class RegistrationService {
  private readonly registerApi = environment.registerApi;
  private readonly confirmRegistrationApi =
    environment.registerApi + '/confirm';

  constructor(private http: HttpClient) {}

  register(
    email: string,
    password: string
  ): Observable<RegistrationResultViewModel> {
    return this.http.post<RegistrationResultViewModel>(
      this.registerApi + '/register',
      {
        email,
        password,
      }
    );
  }

  confirmRegistration(
    verificationId: string,
    code: string
  ): Observable<AuthenticationResultViewModel> {
    return this.http.post<AuthenticationResultViewModel>(
      this.confirmRegistrationApi,
      {
        verificationId,
        code,
      }
    );
  }
}
