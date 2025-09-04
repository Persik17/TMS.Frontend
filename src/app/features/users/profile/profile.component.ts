import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProfileInfoTabComponent } from './profile-info-tab/profile-info-tab.component';
import { ProfileSystemTabComponent } from './profile-system-tab/profile-system-tab.component';
import { ProfileNotifTabComponent } from './profile-notif-tab/profile-notif-tab.component';
import { ProfileSecurityTabComponent } from './profile-security-tab/profile-security-tab.component';
import { User } from '../../../core/models/user.model';
import { NotificationSettings } from '../../../core/models/notification-settings.model';
import { UserService } from '../../../core/services/user.service';
import { NotificationSettingsService } from '../../../core/services/notification-settings.service';
import {
  SystemSettings,
  ThemeType,
} from '../../../core/models/system-settings.model';
import { SystemSettingsService } from '../../../core/services/system-settings.service';
import { NgxMaskDirective, NgxMaskPipe, provideNgxMask } from 'ngx-mask';

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
    NgxMaskDirective,
    NgxMaskPipe,
  ],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit {
  tab: TabType = 'info';
  user: User | null = null;
  originalUser: User | null = null;
  originalNotif: NotificationSettings | null = null;
  notificationSettings: NotificationSettings | null = null;
  bgModalOpen = false;
  systemSettings: SystemSettings | null = null;

  smsRequired = false;
  smsCode = '';
  newEmail = '';
  newPassword = '';
  repeatPassword = '';

  @ViewChild(ProfileInfoTabComponent) infoTab!: ProfileInfoTabComponent;

  constructor(
    private userService: UserService,
    private notificationSettingsService: NotificationSettingsService,
    private systemSettingsService: SystemSettingsService
  ) {}

  ngOnInit(): void {
    const userId = localStorage.getItem('userId')!;
    this.userService.getProfile(userId, userId).subscribe({
      next: (u) => {
        this.user = u;
        this.originalUser = JSON.parse(JSON.stringify(u));
        if (u.notificationSettingsId && u.notificationSettings) {
          this.notificationSettings = { ...u.notificationSettings };
          this.originalNotif = { ...u.notificationSettings };
        } else if (u.notificationSettingsId) {
          this.notificationSettingsService
            .getSettings(u.notificationSettingsId, userId)
            .subscribe({
              next: (settings) => {
                this.notificationSettings = settings;
                this.originalNotif = { ...settings };
              },
              error: () => {
                this.notificationSettings = null;
                this.originalNotif = null;
              },
            });
        } else {
          this.notificationSettings = null;
          this.originalNotif = null;
        }

        if (u.systemSettings) {
          this.systemSettings = {
            ...u.systemSettings,
            theme: u.systemSettings.theme as ThemeType,
          };
        } else {
          this.systemSettingsService.getSystemSettings(userId).subscribe({
            next: (settings) => {
              if (settings) {
                this.systemSettings = {
                  ...settings,
                  theme: settings.theme as ThemeType,
                };
              } else {
                this.systemSettings = {
                  userId,
                  theme: ThemeType.Light,
                  boardBgType: 'template',
                  boardBgUrl: '',
                  boardBgColor: '',
                  boardBgName: '',
                };
              }
            },
            error: () => {
              this.systemSettings = {
                userId,
                theme: ThemeType.Light,
                boardBgType: 'template',
                boardBgUrl: '',
                boardBgColor: '',
                boardBgName: '',
              };
            },
          });
        }
      },
      error: () => {
        this.user = null;
        this.originalUser = null;
        this.originalNotif = null;
        this.notificationSettings = null;
        this.systemSettings = null;
      },
    });
  }

  isUserChanged(): boolean {
    if (!this.user || !this.originalUser) return false;
    return (
      this.user.fullName !== this.originalUser.fullName ||
      this.user.phone !== this.originalUser.phone
    );
  }

  saveProfile() {
    if (!this.user || !this.isUserChanged()) return;
    const userId = localStorage.getItem('userId')!;
    this.userService.updateProfile(userId, this.user, userId).subscribe({
      next: () => {
        if (this.infoTab) {
          this.infoTab.showSaveResult('success', 'Профиль успешно сохранён!');
        }
        this.originalUser = JSON.parse(JSON.stringify(this.user));
      },
      error: () => {
        if (this.infoTab) {
          this.infoTab.showSaveResult('error', 'Ошибка при сохранении профиля');
        }
      },
    });
  }

  saveNotificationSettings() {
    if (!this.notificationSettings) return;
    const changed =
      JSON.stringify(this.notificationSettings) !==
      JSON.stringify(this.originalNotif);
    if (!changed) return;
    const userId = localStorage.getItem('userId')!;
    this.notificationSettingsService
      .updateSettings(
        this.notificationSettings.id,
        this.notificationSettings,
        userId
      )
      .subscribe({
        next: (updated) => {
          this.originalNotif = { ...updated };
          this.notificationSettings = { ...updated };
        },
      });
  }

  onSaveSystemSettings(settings: SystemSettings) {
    this.systemSettingsService
      .updateSystemSettings(settings.userId, {
        ...settings,
        theme: Number(settings.theme),
      })
      .subscribe((updated) => {
        this.systemSettings = {
          ...updated,
          theme: updated.theme as ThemeType,
        };
      });
  }

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
    if (!this.systemSettings) return;
    this.systemSettings.boardBgType = 'template';
    this.systemSettings.boardBgUrl = tpl.url;
    this.systemSettings.boardBgColor = '';
    this.systemSettings.boardBgName = tpl.name;
  }
  selectColorBg(color: string) {
    if (!this.systemSettings) return;
    this.systemSettings.boardBgType = 'color';
    this.systemSettings.boardBgUrl = '';
    this.systemSettings.boardBgColor = color;
    this.systemSettings.boardBgName = color;
  }
  onBoardBgUpload(event: Event) {
    if (!this.systemSettings) return;
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      const reader = new FileReader();
      reader.onload = (e: ProgressEvent<FileReader>) => {
        this.systemSettings!.boardBgType = 'custom';
        this.systemSettings!.boardBgUrl = e.target?.result as string;
        this.systemSettings!.boardBgColor = '';
        this.systemSettings!.boardBgName = file.name;
      };
      reader.readAsDataURL(file);
    }
  }
}
