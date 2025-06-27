import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { User } from '../../../../core/models/user.model';

@Component({
  selector: 'app-profile-info-tab',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './profile-info-tab.component.html',
  styleUrls: ['./profile-info-tab.component.scss'],
})
export class ProfileInfoTabComponent {
  @Input() user!: User;
  @Output() saveProfile = new EventEmitter<void>();
}
