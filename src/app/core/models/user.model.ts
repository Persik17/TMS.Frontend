import { NotificationSettings } from './notification-settings.model';

export interface User {
  id: string;
  fullName: string;
  email: string;
  telegramId?: string;
  timezone: string;
  language: string;
  phone: string;
  status: string;
  notificationSettingsId: string;
  registrationDate: Date;
  lastLoginDate: Date;
  creationDate: string;
  updateDate?: string;
  deleteDate?: string;
  notificationSettings?: NotificationSettings;
}
