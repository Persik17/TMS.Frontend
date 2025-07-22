import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { RegistrationService } from '../../../core/services/registration.service';
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
  mode: 'register' | 'login' = 'register';

  constructor(
    private router: Router,
    private auth: AuthService,
    private registration: RegistrationService
  ) {
    const nav = this.router.getCurrentNavigation();
    this.verificationId = nav?.extras.state?.['verificationId'] || null;
    this.email = nav?.extras.state?.['email'] || null;
    this.mode = nav?.extras.state?.['mode'] || 'register';
  }

  onConfirm() {
    this.error = null;
    if (!this.code.trim() || this.code.length < 4) {
      this.error = 'Введите корректный код из SMS.';
      return;
    }
    this.loading = true;
    let confirmObs;
    if (this.mode === 'register') {
      confirmObs = this.registration.confirmRegistration(
        this.verificationId!,
        this.code
      );
    } else {
      confirmObs = this.auth.confirmLogin(this.verificationId!, this.code);
    }
    confirmObs.subscribe({
      next: (res) => {
        this.loading = false;
        if (res.success) {
          localStorage.setItem('token', res.token!);
          if (res.companyId) localStorage.setItem('companyId', res.companyId);
          if (res.userId) localStorage.setItem('userId', res.userId);
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
