import { Component } from '@angular/core';
import { NgIf, NgFor } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-dashboard-settings',
  standalone: true,
  imports: [NgIf, NgFor, FormsModule],
  templateUrl: './dashboard-settings.component.html',
  styleUrls: ['./dashboard-settings.component.scss'],
})
export class DashboardSettingsComponent {
  tab: 'info' | 'users' = 'info';
  editingUser: any = null;
  oldRole: string = '';

  board = {
    name: 'Маркетинг',
    description: 'Доска для маркетинговых задач',
    department: 'Маркетинг',
    boardType: 1,
    isPrivate: false,
  };

  users = [
    { id: 1, name: 'Иван', email: 'ivan@mail.com', role: 'Редактор' },
    { id: 2, name: 'Мария', email: 'maria@mail.com', role: 'Просмотр' },
  ];

  addUser() {
    const name = prompt('Имя нового пользователя:');
    const email = prompt('Email нового пользователя:');
    if (name && email) {
      this.users.push({ id: Date.now(), name, email, role: 'Просмотр' });
    }
  }

  removeUser(user: any) {
    this.users = this.users.filter((u) => u !== user);
  }

  startEditRole(user: any) {
    this.editingUser = user;
    this.oldRole = user.role;
  }

  saveRoleEdit() {
    this.editingUser = null;
    this.oldRole = '';
  }

  cancelRoleEdit() {
    if (this.editingUser) {
      this.editingUser.role = this.oldRole;
      this.editingUser = null;
      this.oldRole = '';
    }
  }
}
