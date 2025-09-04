import { NotificationSettings } from './notification-settings.model';
import { SystemSettings } from './system-settings.model';

export interface User {
  id: string;
  fullName: string;
  email: string;
  timezone?: string;
  language?: string;
  phone: string;
  notificationSettingsId: string;
  notificationSettings?: NotificationSettings;
  systemSettingsId?: string;
  systemSettings?: SystemSettings;
  registrationDate: Date;
  lastLoginDate: Date;
  creationDate: string;
  updateDate?: string;
  deleteDate?: string;
}
