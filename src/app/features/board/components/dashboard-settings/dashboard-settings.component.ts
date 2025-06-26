import { Component, HostListener } from '@angular/core';
import { NgIf, NgFor, NgStyle, NgClass } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-dashboard-settings',
  standalone: true,
  imports: [NgIf, NgFor, FormsModule, NgStyle, NgClass],
  templateUrl: './dashboard-settings.component.html',
  styleUrls: ['./dashboard-settings.component.scss'],
})
export class DashboardSettingsComponent {
  tab: 'info' | 'users' = 'info';
  users: BoardUser[] = [
    {
      id: 1,
      name: 'Иван',
      email: 'ivan@mail.com',
      status: 'Активный',
      permissions: {
        tasks: 'Редактирование',
        board: 'Чтение',
        members: 'Нет',
      },
    },
    {
      id: 2,
      name: 'Мария',
      email: 'maria@mail.com',
      status: 'Активный',
      permissions: {
        tasks: 'Чтение',
        board: 'Чтение',
        members: 'Нет',
      },
    },
    {
      id: 3,
      name: '',
      email: 'invited@user.com',
      status: 'Приглашён',
      permissions: {
        tasks: 'Нет',
        board: 'Чтение',
        members: 'Нет',
      },
    },
  ];
  showInviteModal = false;
  inviteEmail = '';
  inviteError = '';

  accessLevels: AccessLevel[] = [
    'Нет',
    'Чтение',
    'Редактирование',
    'Администрирование',
  ];
  accessIcons: Record<AccessLevel, string> = {
    Нет: '❌',
    Чтение: '👁️',
    Редактирование: '✏️',
    Администрирование: '⭐',
  };
  accessTitles: Record<AccessLevel, string> = {
    Нет: 'Нет доступа',
    Чтение: 'Только чтение',
    Редактирование: 'Редактирование',
    Администрирование: 'Администрирование',
  };

  permissionFields: (keyof UserPermissions)[] = ['tasks', 'board', 'members'];
  permissionFieldLabels: Record<keyof UserPermissions, string> = {
    tasks: 'Задачи',
    board: 'Доска',
    members: 'Участники',
  };

  // Контекстное меню
  permissionMenuShow = false;
  permissionMenuLeft = 0;
  permissionMenuTop = 0;
  permissionMenuUser: BoardUser | null = null;
  permissionMenuField: keyof UserPermissions | null = null;

  // Для отслеживания изменений
  originalPermissions: Record<number, UserPermissions> = {};
  permissionDiffs: PermissionsDiff[] = [];
  hasMatrixChanges = false;

  board = {
    name: 'Маркетинг',
    description: 'Доска для маркетинговых задач',
    department: 'Маркетинг',
    boardType: 1,
    isPrivate: false,
  };

  constructor() {
    this.saveOriginalPermissions();
  }

  saveOriginalPermissions() {
    this.originalPermissions = {};
    for (const user of this.users) {
      this.originalPermissions[user.id] = { ...user.permissions };
    }
    this.hasMatrixChanges = false;
    this.permissionDiffs = [];
  }

  detectMatrixChanges() {
    const diffs: PermissionsDiff[] = [];
    for (const user of this.users) {
      const orig = this.originalPermissions[user.id];
      if (!orig) continue;
      const changedFields: (keyof UserPermissions)[] = [];
      for (const field of this.permissionFields) {
        if (orig[field] !== user.permissions[field]) {
          changedFields.push(field);
        }
      }
      if (changedFields.length > 0) {
        diffs.push({
          userId: user.id,
          before: { ...orig },
          after: { ...user.permissions },
          changedFields,
        });
      }
    }
    this.permissionDiffs = diffs;
    this.hasMatrixChanges = diffs.length > 0;
  }

  isPermissionChanged(user: BoardUser, field: keyof UserPermissions): boolean {
    const orig = this.originalPermissions[user.id];
    return orig && orig[field] !== user.permissions[field];
  }

  addUser() {
    this.inviteEmail = '';
    this.inviteError = '';
    this.showInviteModal = true;
  }

  confirmInvite() {
    const email = this.inviteEmail.trim();
    if (!email.match(/^[\w\.-]+@[\w\.-]+\.\w{2,}$/)) {
      this.inviteError = 'Введите корректный email';
      return;
    }
    if (this.users.some((u) => u.email === email)) {
      this.inviteError = 'Пользователь с таким email уже есть в списке';
      return;
    }
    const newUser: BoardUser = {
      id: Date.now(),
      name: '',
      email,
      status: 'Приглашён',
      permissions: {
        tasks: 'Нет',
        board: 'Чтение',
        members: 'Нет',
      },
    };
    this.users.push(newUser);
    this.originalPermissions[newUser.id] = { ...newUser.permissions };
    this.showInviteModal = false;
  }

  removeUser(user: BoardUser) {
    this.users = this.users.filter((u) => u !== user);
    delete this.originalPermissions[user.id];
    this.detectMatrixChanges();
  }

  cyclePermission(
    user: BoardUser,
    field: keyof UserPermissions,
    event: MouseEvent
  ) {
    event.preventDefault();
    if (user.status !== 'Активный') return;
    const value = user.permissions[field];
    const idx = this.accessLevels.indexOf(value);
    const nextIdx = (idx + 1) % this.accessLevels.length;
    user.permissions[field] = this.accessLevels[nextIdx];
    this.detectMatrixChanges();
    this.closePermissionMenu();
  }

  openPermissionMenu(
    user: BoardUser,
    field: keyof UserPermissions,
    event: MouseEvent
  ) {
    event.preventDefault();
    if (user.status !== 'Активный') return;
    this.permissionMenuShow = true;
    this.permissionMenuLeft = event.clientX;
    this.permissionMenuTop = event.clientY;
    this.permissionMenuUser = user;
    this.permissionMenuField = field;
  }

  selectPermission(level: AccessLevel) {
    if (
      this.permissionMenuUser &&
      this.permissionMenuField &&
      this.permissionMenuUser.status === 'Активный'
    ) {
      this.permissionMenuUser.permissions[this.permissionMenuField] = level;
      this.detectMatrixChanges();
    }
    this.closePermissionMenu();
  }

  isSelected(level: AccessLevel): boolean {
    return !!(
      this.permissionMenuUser &&
      this.permissionMenuField &&
      this.permissionMenuUser.permissions[this.permissionMenuField] === level
    );
  }

  closePermissionMenu() {
    this.permissionMenuShow = false;
    this.permissionMenuUser = null;
    this.permissionMenuField = null;
  }

  closeModal() {
    this.showInviteModal = false;
    this.inviteEmail = '';
    this.inviteError = '';
  }

  saveMatrixChanges() {
    // Здесь вы отправляете permissionDiffs на сервер пачкой
    // Пример: this.http.post('/api/permissions/update', this.permissionDiffs).subscribe(...)
    // После успешного сохранения:
    this.saveOriginalPermissions();
  }

  @HostListener('window:scroll')
  onScroll() {
    this.closePermissionMenu();
  }
}
