import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface NotificationSettingViewModel {
  id: string;
  emailNotificationsEnabled: boolean;
  pushNotificationsEnabled: boolean;
  telegramNotificationsEnabled: boolean;
}

export interface UserViewModel {
  id: string;
  fullName: string;
  email: string;
  telegramId?: string;
  timezone: string;
  language: string;
  phone: string;
  status: number;
  notificationSettingsId: string;
  registrationDate: string;
  lastLoginDate: string;
  creationDate: string;
  updateDate?: string;
  deleteDate?: string;
  notificationSettings?: NotificationSettingViewModel;
}

@Injectable({ providedIn: 'root' })
export class UserService {
  private readonly apiUrl = 'https://localhost:7087/api/user';

  constructor(private http: HttpClient) {}

  getProfile(): Observable<UserViewModel> {
    return this.http.get<UserViewModel>(`${this.apiUrl}/profile`);
  }
}
