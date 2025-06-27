import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NotificationSettings } from '../../../../core/models/notification-settings.model';

@Component({
  selector: 'app-profile-notif-tab',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './profile-notif-tab.component.html',
  styleUrls: ['./profile-notif-tab.component.scss'],
})
export class ProfileNotifTabComponent {
  @Input() userNotif!: NotificationSettings;
  @Input() originalNotif!: NotificationSettings;
  @Output() saveNotificationSettings = new EventEmitter<void>();
}
