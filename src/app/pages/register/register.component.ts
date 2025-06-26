import { Component } from '@angular/core';
import { RegistrationService } from '../../services/registration.service';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-register',
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
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent {
  email = '';
  password = '';
  error: string | null = null;
  loading = false;

  constructor(private reg: RegistrationService, private router: Router) {}

  onRegister() {
    this.error = null;
    this.loading = true;
    this.reg.register(this.email, this.password).subscribe({
      next: (res) => {
        this.loading = false;
        if (res.success && res.verificationId) {
          this.router.navigate(['/confirm-sms'], {
            state: { verificationId: res.verificationId, email: this.email },
          });
        } else {
          this.error = res.error || 'Ошибка регистрации';
        }
      },
      error: (err) => {
        this.loading = false;
        this.error = err.error?.error || 'Ошибка соединения с сервером';
      },
    });
  }
}
