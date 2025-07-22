import { Component } from '@angular/core';
import {
  AuthService,
  TelegramAuthViewModel,
} from '../../../core/services/auth.service';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { TelegramLoginWidgetComponent } from '../../../shared/components/telegram-login-widget/telegram-login-widget';
import { CookieConsentBannerComponent } from '../../../shared/components/cookie-banner/cookie-consent-banner';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    FormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    TelegramLoginWidgetComponent,
    CookieConsentBannerComponent,
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  email = '';
  password = '';
  error: string | null = null;
  loading = false;

  constructor(private auth: AuthService, private router: Router) {}

  onLogin() {
    this.error = null;
    this.loading = true;
    this.auth.login(this.email, this.password).subscribe({
      next: (res) => {
        this.loading = false;
        if (res.success && res.verificationId) {
          this.router.navigate(['/confirm-sms'], {
            state: {
              verificationId: res.verificationId,
              email: this.email,
              mode: 'login',
            },
          });
        } else {
          this.error = res.error || 'Ошибка Авторизации';
        }
      },
      error: (err) => {
        this.loading = false;
        this.error = err.error?.error || 'Ошибка соединения с сервером';
      },
    });
  }

  onTelegramAuth(user: TelegramAuthViewModel) {
    this.loading = true;
    this.error = null;
    this.auth.loginViaTelegram(user).subscribe({
      next: (res) => {
        this.loading = false;
        if (res.success) {
          localStorage.setItem('token', res.token!);
          this.router.navigate(['/boards']);
        } else {
          this.error = res.error || 'Ошибка авторизации через Telegram';
        }
      },
      error: (err) => {
        this.loading = false;
        this.error = err.error?.error || 'Ошибка соединения с сервером';
      },
    });
  }
}
