import { Component, AfterViewInit, NgZone } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';

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
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements AfterViewInit {
  email = '';
  password = '';
  error: string | null = null;
  loading = false;
  cookieConsentVisible = false;

  constructor(
    private auth: AuthService,
    private zone: NgZone,
    private router: Router
  ) {}

  onLogin() {
    this.error = null;
    this.loading = true;
    this.auth.login(this.email, this.password).subscribe({
      next: (res) => {
        this.loading = false;
        if (res.success) {
          localStorage.setItem('token', res.token!);
          // Вместо dashboard редирект на sms подтверждение
          this.router.navigate(['/confirm-sms'], {
            state: { email: this.email },
          });
        } else {
          this.error = res.error || 'Ошибка авторизации';
        }
      },
      error: (err) => {
        this.loading = false;
        this.error = err.error?.error || 'Ошибка соединения с сервером';
      },
    });
  }

  ngAfterViewInit() {
    // Проверка согласия на cookies
    const consent = localStorage.getItem('cookie_consent');
    if (consent !== 'accepted') {
      this.cookieConsentVisible = true;
    }

    // Telegram widget
    const script = document.createElement('script');
    script.src = 'https://telegram.org/js/telegram-widget.js?7';
    script.setAttribute('data-telegram-login', 'tms_notify_support_bot');
    script.setAttribute('data-size', 'large');
    script.setAttribute('data-radius', '8');
    script.setAttribute(
      'data-auth-url',
      'https://localhost:7087/api/auth/telegram'
    );
    script.setAttribute('data-request-access', 'write');
    script.setAttribute('data-userpic', 'true');
    script.async = true;
    document.getElementById('telegram-login-widget')?.appendChild(script);
    script.async = true;

    const container = document.getElementById('telegram-login-widget');
    if (container) {
      container.innerHTML = '';
      container.appendChild(script);
    }
  }

  acceptCookies() {
    localStorage.setItem('cookie_consent', 'accepted');
    this.cookieConsentVisible = false;
  }

  declineCookies() {
    localStorage.setItem('cookie_consent', 'declined');
    this.cookieConsentVisible = false;
    // Можно добавить логику ограничения функционала
  }
}
