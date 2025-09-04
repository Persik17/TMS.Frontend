import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { NotificationSettings } from '../models/notification-settings.model';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class NotificationSettingsService {
  private readonly baseUrl =
    environment.notificationSettingsApi ||
    environment.apiBaseUrl + '/notificationsetting';

  constructor(private http: HttpClient) {}

  getSettings(id: string, userId: string): Observable<NotificationSettings> {
    return this.http.get<NotificationSettings>(
      `${this.baseUrl}/${id}?userId=${userId}`
    );
  }

  updateSettings(
    id: string,
    settings: NotificationSettings,
    userId: string
  ): Observable<NotificationSettings> {
    return this.http.put<NotificationSettings>(
      `${this.baseUrl}/${id}?userId=${userId}`,
      settings
    );
  }
}
