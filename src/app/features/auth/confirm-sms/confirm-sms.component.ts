import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-confirm-sms',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
  ],
  templateUrl: './confirm-sms.component.html',
  styleUrls: ['./confirm-sms.component.scss'],
})
export class ConfirmSmsComponent {
  verificationId: string | null = null;
  email: string | null = null;
  code: string = '';
  error: string | null = null;
  loading = false;

  constructor(private router: Router, private auth: AuthService) {
    const nav = this.router.getCurrentNavigation();
    this.verificationId = nav?.extras.state?.['verificationId'] || null;
    this.email = nav?.extras.state?.['email'] || null;
  }

  onConfirm() {
    this.error = null;
    if (!this.code.trim() || this.code.length < 4) {
      this.error = 'Введите корректный код из SMS.';
      return;
    }
    this.loading = true;
    this.auth
      .confirmSms(this.verificationId || this.email || '', this.code)
      .subscribe({
        next: (res) => {
          this.loading = false;
          if (res.success) {
            localStorage.setItem('token', res.token!);
            this.router.navigate(['/post-login-redirect']);
          } else {
            this.error = res.error || 'Ошибка подтверждения';
          }
        },
        error: (err) => {
          this.loading = false;
          this.error = err.error?.error || 'Ошибка соединения с сервером';
        },
      });
  }

  onCodeInput(event: Event) {
    const input = event.target as HTMLInputElement;
    input.value = input.value.replace(/\D/g, '').slice(0, 6);
    this.code = input.value;
  }
}
