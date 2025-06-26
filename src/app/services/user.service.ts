import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserViewModel } from '../models/user.model';
import { environment } from '../environments/environment';

@Injectable({ providedIn: 'root' })
export class UserService {
  private readonly baseUrl = environment.userApi;

  constructor(private http: HttpClient) {}

  getProfile(): Observable<UserViewModel> {
    return this.http.get<UserViewModel>(`${this.baseUrl}/profile`);
  }
}
