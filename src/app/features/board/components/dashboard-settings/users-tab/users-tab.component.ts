import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule, NgFor, NgIf, NgClass, NgStyle } from '@angular/common';
import { FormsModule } from '@angular/forms';

export interface UserPermissions {
  tasks: AccessLevel;
  board: AccessLevel;
  members: AccessLevel;
}
export type AccessLevel =
  | 'Нет'
  | 'Чтение'
  | 'Редактирование'
  | 'Администрирование';

export interface BoardUser {
  id: string;
  name: string;
  email: string;
  status: string;
  permissions: UserPermissions;
}

@Component({
  selector: 'app-dashboard-settings-users-tab',
  standalone: true,
  imports: [CommonModule, NgFor, NgIf, NgClass, NgStyle, FormsModule],
  templateUrl: './users-tab.component.html',
  styleUrls: ['./users-tab.component.scss'],
})
export class UsersTabComponent {
  @Input() users: BoardUser[] = [];
  @Input() permissionFields: (keyof UserPermissions)[] = [
    'tasks',
    'board',
    'members',
  ];
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
  @Input() originalPermissions: Record<string, UserPermissions> = {};
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
  @Output() inviteEmailChange = new EventEmitter<string>();

  isPermissionChanged(user: BoardUser, field: keyof UserPermissions): boolean {
    const orig = this.originalPermissions[user.id];
    return orig && orig[field] !== user.permissions[field];
  }
}
