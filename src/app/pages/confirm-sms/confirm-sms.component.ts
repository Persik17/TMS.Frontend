import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-confirm-sms',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule
  ],
  templateUrl: './confirm-sms.component.html',
  styleUrls: ['./confirm-sms.component.scss']
})
export class ConfirmSmsComponent {
  verificationId: string | null = null;
  email: string | null = null;

  constructor(private router: Router) {
    const nav = this.router.getCurrentNavigation();
    this.verificationId = nav?.extras.state?.['verificationId'] || null;
    this.email = nav?.extras.state?.['email'] || null;
  }
}
