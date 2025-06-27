import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProfileInfoTabComponent } from './profile-info-tab/profile-info-tab.component';
import { ProfileSystemTabComponent } from './profile-system-tab/profile-system-tab.component';
import { ProfileNotifTabComponent } from './profile-notif-tab/profile-notif-tab.component';
import { ProfileSecurityTabComponent } from './profile-security-tab/profile-security-tab.component';
import { User } from '../../../core/models/user.model';
import { NotificationSettings } from '../../../core/models/notification-settings.model';

type TabType = 'info' | 'system' | 'notif' | 'security';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ProfileInfoTabComponent,
    ProfileSystemTabComponent,
    ProfileNotifTabComponent,
    ProfileSecurityTabComponent,
  ],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent {
  tab: TabType = 'info';

  user: User = {
    fullName: 'Иван Петров',
    language: 'ru',
    phone: '+7 900 123-45-67',
    telegramId: 'petrov_ivan',
    timezone: 'Europe/Moscow',
    status: 'Активен',
    registrationDate: new Date('2023-05-01T10:33:00'),
    lastLoginDate: new Date(),
    notificationSettings: {
      emailNotificationsEnabled: true,
      pushNotificationsEnabled: false,
      telegramNotificationsEnabled: true,
      id: '',
    },
    id: '',
    email: '',
    notificationSettingsId: '',
    creationDate: '',
  };

  originalNotif: NotificationSettings = {
    emailNotificationsEnabled: true,
    pushNotificationsEnabled: false,
    telegramNotificationsEnabled: true,
    id: '',
  };

  // System settings
  bgModalOpen = false;
  bgTemplates = [
    { name: 'Заглушка 1', url: 'https://picsum.photos/120/60?random=1' },
    { name: 'Заглушка 2', url: 'https://placehold.co/120x60?text=Board+BG' },
    {
      name: 'Заглушка 3',
      url: 'https://dummyimage.com/120x60/1976d2/fff&text=BG',
    },
  ];
  bgColors = ['#f7cac9', '#92a8d1', '#f9f871', '#b5ead7', '#ffffff', '#232323'];
  systemSettings = {
    theme: 'light',
    boardBgType: 'template' as 'template' | 'color' | 'custom',
    boardBgUrl: 'https://picsum.photos/120/60?random=1',
    boardBgColor: '',
    boardBgName: 'Заглушка 1',
  };

  smsRequired = false;
  smsCode = '';
  newEmail = '';
  newPassword = '';
  repeatPassword = '';

  saveProfile() {
    alert('Профиль сохранён!');
  }

  saveNotificationSettings() {
    alert('Настройки оповещений сохранены!');
  }

  changeEmail() {
    this.smsRequired = true;
    alert(
      'Ссылка для подтверждения отправлена на новый email. Введите код из SMS для подтверждения.'
    );
  }

  changePassword() {
    if (this.newPassword !== this.repeatPassword) {
      alert('Пароли не совпадают!');
      return;
    }
    this.smsRequired = true;
    alert('Пароль изменён. Введите код из SMS для подтверждения.');
  }

  confirmSmsCode() {
    if (this.smsCode.trim().length === 6) {
      this.smsRequired = false;
      this.smsCode = '';
      alert('SMS подтверждение прошло успешно!');
    } else {
      alert('Введите корректный 6-значный код из SMS');
    }
  }

  openBgModal() {
    this.bgModalOpen = true;
  }
  closeBgModal() {
    this.bgModalOpen = false;
  }
  selectTemplateBg(tpl: { name: string; url: string }) {
    this.systemSettings.boardBgType = 'template';
    this.systemSettings.boardBgUrl = tpl.url;
    this.systemSettings.boardBgColor = '';
    this.systemSettings.boardBgName = tpl.name;
  }
  selectColorBg(color: string) {
    this.systemSettings.boardBgType = 'color';
    this.systemSettings.boardBgUrl = '';
    this.systemSettings.boardBgColor = color;
    this.systemSettings.boardBgName = color;
  }
  onBoardBgUpload(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      const reader = new FileReader();
      reader.onload = (e: ProgressEvent<FileReader>) => {
        this.systemSettings.boardBgType = 'custom';
        this.systemSettings.boardBgUrl = e.target?.result as string;
        this.systemSettings.boardBgColor = '';
        this.systemSettings.boardBgName = file.name;
      };
      reader.readAsDataURL(file);
    }
  }
}
