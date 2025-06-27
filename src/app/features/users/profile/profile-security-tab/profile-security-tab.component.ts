import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-profile-security-tab',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './profile-security-tab.component.html',
  styleUrls: ['./profile-security-tab.component.scss'],
})
export class ProfileSecurityTabComponent {
  @Input() newEmail = '';
  @Input() newPassword = '';
  @Input() repeatPassword = '';
  @Input() smsRequired = false;
  @Input() smsCode = '';

  @Output() newEmailChange = new EventEmitter<string>();
  @Output() newPasswordChange = new EventEmitter<string>();
  @Output() repeatPasswordChange = new EventEmitter<string>();
  @Output() smsCodeChange = new EventEmitter<string>();

  @Output() changeEmail = new EventEmitter<void>();
  @Output() changePassword = new EventEmitter<void>();
  @Output() confirmSmsCode = new EventEmitter<void>();
}
