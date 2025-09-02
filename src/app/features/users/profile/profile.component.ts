import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProfileInfoTabComponent } from './profile-info-tab/profile-info-tab.component';
import { ProfileSystemTabComponent } from './profile-system-tab/profile-system-tab.component';
import { ProfileNotifTabComponent } from './profile-notif-tab/profile-notif-tab.component';
import { ProfileSecurityTabComponent } from './profile-security-tab/profile-security-tab.component';
import { User } from '../../../core/models/user.model';
import { NotificationSettings } from '../../../core/models/notification-settings.model';
import { UserService } from '../../../core/services/user.service';

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
export class ProfileComponent implements OnInit {
  tab: TabType = 'info';

  user!: User;

  originalNotif!: NotificationSettings;

  // System settings
  bgModalOpen = false;
  bgTemplates: { name: string; url: string }[] = [];
  bgColors = ['#f7cac9', '#92a8d1', '#f9f871', '#b5ead7', '#ffffff', '#232323'];
  systemSettings = {
    theme: 'light',
    boardBgType: 'template' as 'template' | 'color' | 'custom',
    boardBgUrl: '',
    boardBgColor: '',
    boardBgName: '',
  };

  smsRequired = false;
  smsCode = '';
  newEmail = '';
  newPassword = '';
  repeatPassword = '';

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.userService.getProfile().subscribe((u) => {
      this.user = u;
      this.originalNotif = u.notificationSettings as NotificationSettings;
    });
  }

  saveProfile() {}

  saveNotificationSettings() {}

  changeEmail() {
    this.smsRequired = true;
  }

  changePassword() {
    if (this.newPassword !== this.repeatPassword) {
      return;
    }
    this.smsRequired = true;
  }

  confirmSmsCode() {
    if (this.smsCode.trim().length === 6) {
      this.smsRequired = false;
      this.smsCode = '';
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
