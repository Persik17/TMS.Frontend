import { NotificationSettingViewModel } from "./notification-settings.model";

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
