import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RegistrationResultViewModel } from '../models/registration-result.model';
import { environment } from '../environments/environment';

@Injectable({ providedIn: 'root' })
export class RegistrationService {
  private readonly baseUrl = environment.registerApi;

  constructor(private http: HttpClient) {}

  register(
    email: string,
    password: string
  ): Observable<RegistrationResultViewModel> {
    const payload = {
      target: email,
      type: 1,
      password,
    };
    return this.http.post<RegistrationResultViewModel>(this.baseUrl, payload);
  }
}
