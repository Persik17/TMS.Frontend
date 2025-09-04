import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { User } from '../../../../core/models/user.model';
import { NgxMaskDirective, NgxMaskPipe } from 'ngx-mask';

@Component({
  selector: 'app-profile-info-tab',
  standalone: true,
  imports: [CommonModule, FormsModule, NgxMaskDirective, NgxMaskPipe],
  templateUrl: './profile-info-tab.component.html',
  styleUrls: ['./profile-info-tab.component.scss'],
})
export class ProfileInfoTabComponent {
  @Input() user!: User;
  @Output() saveProfile = new EventEmitter<void>();

  saveResult: {
    show: boolean;
    status: 'success' | 'error';
    message: string;
  } | null = null;

  showSaveResult(status: 'success' | 'error', msg: string) {
    this.saveResult = {
      show: true,
      status,
      message: msg,
    };
    setTimeout(() => {
      if (this.saveResult) this.saveResult.show = false;
    }, 2200);
  }
}
