import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-profile',
  imports: [FormsModule, CommonModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit {
  tab: 'info' | 'system' | 'notif' | 'security' = 'info';

  user = {
    fullName: 'Иван Петров',
    email: 'ivan.petrov@mail.com',
    phone: '+7 999 123-45-67',
    language: 'Русский',
    timezone: 'Europe/Moscow',
    telegramId: '123456789',
    status: 'Активен',
    registrationDate: new Date('2023-01-01T10:00:00'),
    lastLoginDate: new Date('2025-06-20T20:15:00'),
    notificationSettings: {
      emailNotificationsEnabled: true,
      pushNotificationsEnabled: true,
      telegramNotificationsEnabled: false,
    },
  };

  systemSettings = {
    theme: 'light',
    boardBgName: '',
  };

  // Для смены email/пароля
  newEmail = '';
  newPassword = '';
  repeatPassword = '';
  smsRequired = false;
  smsCode = '';

  ngOnInit() {}

  saveProfile() {
    // Тут отправка на сервер
    alert('Изменения профиля сохранены!');
  }

  changeEmail() {
    // Тут отправка запроса на смену email
    this.smsRequired = true;
    alert('Код для подтверждения смены email отправлен по SMS.');
  }

  changePassword() {
    // Тут отправка запроса на смену пароля
    this.smsRequired = true;
    alert('Код для подтверждения смены пароля отправлен по SMS.');
  }

  confirmSmsCode() {
    // Тут логика проверки кода
    alert('Код подтвержден! Email/пароль успешно изменены.');
    this.smsRequired = false;
    this.newEmail = '';
    this.newPassword = '';
    this.repeatPassword = '';
    this.smsCode = '';
  }

  onBoardBgChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      // Например, просто сохраним имя выбранного файла:
      this.systemSettings.boardBgName = file.name;
      // Если нужно загрузить/отправить файл - реализуй дальше по логике
    } else {
      this.systemSettings.boardBgName = '';
    }
  }

  // Метод для сохранения настроек оповещений
  saveNotificationSettings(): void {
    // Здесь ты можешь отправить настройки на сервер
    // Например:
    // this.apiService.saveNotifications(this.user.notificationSettings).subscribe(...)
    alert('Настройки оповещений сохранены!');
  }
}
