import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule, NgFor, NgIf, NgClass, NgStyle } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserPermissions } from '../../../../../core/models/user-permissions.model';
import { AccessLevel } from '../../../../../core/models/access-level.model';
import { BoardUser } from '../../../../../core/models/board-user.model';

@Component({
  selector: 'app-dashboard-settings-users-tab',
  standalone: true,
  imports: [CommonModule, NgFor, NgIf, NgClass, NgStyle, FormsModule],
  templateUrl: './users-tab.component.html',
  styleUrls: ['./users-tab.component.scss'],
})
export class DashboardSettingsUsersTabComponent {
  @Input() users: BoardUser[] = [];
  @Input() permissionFields: (keyof UserPermissions)[] = [];
  @Input() permissionFieldLabels: Record<keyof UserPermissions, string> = {
    tasks: 'Задачи',
    board: 'Доска',
    members: 'Участники',
  };
  @Input() accessLevels: AccessLevel[] = [
    'Нет',
    'Чтение',
    'Редактирование',
    'Администрирование',
  ];
  @Input() accessIcons: Record<AccessLevel, string> = {
    Нет: '❌',
    Чтение: '👁️',
    Редактирование: '✏️',
    Администрирование: '⭐',
  };
  @Input() accessTitles: Record<AccessLevel, string> = {
    Нет: 'Нет доступа',
    Чтение: 'Только чтение',
    Редактирование: 'Редактирование',
    Администрирование: 'Администрирование',
  };
  @Input() originalPermissions: Record<number, UserPermissions> = {};
  @Input() hasMatrixChanges: boolean = false;

  @Input() permissionMenuShow = false;
  @Input() permissionMenuLeft = 0;
  @Input() permissionMenuTop = 0;
  @Input() permissionMenuUser: BoardUser | null = null;
  @Input() permissionMenuField: keyof UserPermissions | null = null;

  @Input() showInviteModal = false;
  @Input() inviteEmail = '';
  @Input() inviteError = '';

  @Output() addUser = new EventEmitter<void>();
  @Output() removeUser = new EventEmitter<BoardUser>();
  @Output() cyclePermission = new EventEmitter<{
    user: BoardUser;
    field: keyof UserPermissions;
    domEvent: MouseEvent;
  }>();
  @Output() openPermissionMenu = new EventEmitter<{
    user: BoardUser;
    field: keyof UserPermissions;
    domEvent: MouseEvent;
  }>();
  @Output() saveMatrixChanges = new EventEmitter<void>();
  @Output() confirmInvite = new EventEmitter<void>();
  @Output() closeModal = new EventEmitter<void>();
  @Output() closePermissionMenu = new EventEmitter<void>();
  @Output() selectPermission = new EventEmitter<AccessLevel>();
  @Output() isSelected = new EventEmitter<AccessLevel>();

  isPermissionChanged(user: BoardUser, field: keyof UserPermissions): boolean {
    const orig = this.originalPermissions[user.id];
    return orig && orig[field] !== user.permissions[field];
  }
}
