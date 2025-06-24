import { Component, AfterViewInit, NgZone } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
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
          this.router.navigate(['/dashboard']);
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
    const script = document.createElement('script');
    script.src = 'https://telegram.org/js/telegram-widget.js?7';
    script.setAttribute('data-telegram-login', 'tms_notify_support_bot'); // без @
    script.setAttribute('data-size', 'large');
    script.setAttribute('data-userpic', 'true');
    script.setAttribute('data-request-access', 'write');
    // укажите ваш backend для обработки Telegram auth:
    script.setAttribute(
      'data-auth-url',
      'http://127.0.0.1:5000/api/auth/telegram'
    );
    script.async = true;

    // Очищаем контейнер и вставляем скрипт
    const container = document.getElementById('telegram-login-widget');
    if (container) {
      container.innerHTML = '';
      container.appendChild(script);
    }
  }
}
