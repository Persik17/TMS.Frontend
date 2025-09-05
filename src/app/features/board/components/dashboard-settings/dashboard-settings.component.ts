import { Component, HostListener, OnInit } from '@angular/core';
import { NgIf, NgFor, NgStyle, NgClass } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { InfoTabComponent } from './info-tab/info-tab.component';
import { UsersTabComponent } from './users-tab/users-tab.component';
import { BoardUser } from '../../../../core/models/board-user.model';
import { AccessLevel } from '../../../../core/models/access-level.model';
import { UserPermissions } from '../../../../core/models/user-permissions.model';
import { PermissionsDiff } from '../../../../core/models/permissions-diff.model';
import { Board } from '../../../../core/models/board.model';
import { BoardService } from '../../../../core/services/board.service';

@Component({
  selector: 'app-dashboard-settings',
  standalone: true,
  imports: [
    NgIf,
    NgFor,
    FormsModule,
    NgStyle,
    NgClass,
    InfoTabComponent,
    UsersTabComponent,
  ],
  templateUrl: './dashboard-settings.component.html',
  styleUrls: ['./dashboard-settings.component.scss'],
})
export class DashboardSettingsComponent implements OnInit {
  tab: 'info' | 'users' = 'info';
  users: BoardUser[] = [];
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

  permissionMenuShow = false;
  permissionMenuLeft = 0;
  permissionMenuTop = 0;
  permissionMenuUser: BoardUser | null = null;
  permissionMenuField: keyof UserPermissions | null = null;

  originalPermissions: Record<string, UserPermissions> = {};
  permissionDiffs: PermissionsDiff[] = [];
  hasMatrixChanges = false;

  board: Board | null = null;
  boardLoading = true;
  boardError = '';

  constructor(
    private route: ActivatedRoute,
    private boardService: BoardService
  ) {}

  ngOnInit() {
    const companyId = localStorage.getItem('companyId');
    const boardId = this.route.snapshot.paramMap.get('id');

    if (!companyId || !boardId) {
      this.boardError = 'Некорректный адрес доски или компании';
      this.boardLoading = false;
      return;
    }
    this.boardLoading = true;
    this.boardService.getBoard(companyId, boardId).subscribe({
      next: (b) => {
        this.board = b;
        this.boardLoading = false;
      },
      error: () => {
        this.boardError = 'Ошибка загрузки доски';
        this.boardLoading = false;
      },
    });

    this.loadBoardUsers(companyId, boardId);
  }

  loadBoardUsers(companyId: string, boardId: string) {
    const userId = localStorage.getItem('userId') || '';
    this.boardService.getBoardUsers(companyId, boardId, userId).subscribe({
      next: (users) => {
        this.users = users.map((u) => ({
          id: u.id,
          name: u.fullName,
          email: u.email,
          status: u.status === 1 ? 'Активный' : 'Приглашён',
          permissions: u.permissions || {
            tasks: 'Нет',
            board: 'Нет',
            members: 'Нет',
          },
        }));
        this.saveOriginalPermissions();
      },
      error: () => {
        this.users = [];
      },
    });
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
    console.log('inviteEmail=', JSON.stringify(this.inviteEmail));
    const email = this.inviteEmail.trim();
    if (!/^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/.test(email)) {
      this.inviteError = 'Введите корректный email';
      return;
    }
    if (this.users.some((u) => u.email === email)) {
      this.inviteError = 'Пользователь с таким email уже есть в списке';
      return;
    }

    this.inviteError = '';
    const companyId = localStorage.getItem('companyId');
    const boardId = this.board?.id;
    const userId = localStorage.getItem('userId') || '';
    if (!companyId || !boardId) {
      this.inviteError = 'Ошибка приглашения';
      return;
    }
    const invite = {
      fullName: '',
      email,
      roles: ['BoardMember'],
      language: 'ru',
    };

    this.boardService.inviteUser(companyId, boardId, invite).subscribe({
      next: () => {
        this.showInviteModal = false;
        this.inviteEmail = '';
        this.loadBoardUsers(companyId, boardId);
      },
      error: (err) => {
        this.inviteError = err?.error?.message || 'Ошибка приглашения';
      },
    });
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
    this.saveOriginalPermissions();
  }

  @HostListener('window:scroll')
  onScroll() {
    this.closePermissionMenu();
  }
}
