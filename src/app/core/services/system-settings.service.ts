import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SystemSettings } from '../models/system-settings.model';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class SystemSettingsService {
  private readonly baseUrl = environment.apiBaseUrl;

  constructor(private http: HttpClient) {}

  getSystemSettings(userId: string): Observable<SystemSettings> {
    return this.http.get<SystemSettings>(
      `${this.baseUrl}/users/${userId}/system-settings`
    );
  }

  updateSystemSettings(
    userId: string,
    settings: SystemSettings
  ): Observable<SystemSettings> {
    return this.http.put<SystemSettings>(
      `${this.baseUrl}/users/${userId}/system-settings`,
      settings
    );
  }
  createSystemSettings(
    userId: string,
    settings: SystemSettings
  ): Observable<SystemSettings> {
    return this.http.post<SystemSettings>(
      `${this.baseUrl}/users/${userId}/system-settings`,
      settings
    );
  }

  deleteSystemSettings(userId: string, id: string): Observable<void> {
    return this.http.delete<void>(
      `${this.baseUrl}/users/${userId}/system-settings/${id}`
    );
  }
}
