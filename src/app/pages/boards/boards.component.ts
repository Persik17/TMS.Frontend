import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BoardStub } from './board.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-boards',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './boards.component.html',
  styleUrls: ['./boards.component.scss'],
})
export class BoardsComponent {
  constructor(private router: Router) {}

  boards: BoardStub[] = [
    { id: '1', name: 'Проект Alpha', owner: 'Иван Петров', privacy: 'private' },
    {
      id: '2',
      name: 'Общая доска',
      owner: 'Елена Сидорова',
      privacy: 'public',
    },
    {
      id: '3',
      name: 'Маркетинг 2025',
      owner: 'Иван Петров',
      privacy: 'private',
    },
    { id: '4', name: 'HR и найм', owner: 'Мария Ким', privacy: 'public' },
  ];

  filterName = '';
  filterOwner = '';
  filterPrivacy: '' | 'private' | 'public' = '';

  // For new board creation
  creatingBoard = false;
  newBoardName = '';
  newBoardPrivacy: 'private' | 'public' = 'private';
  newBoardOwner = 'Вы'; // Можно подставить из профиля

  get filteredBoards(): BoardStub[] {
    return this.boards.filter(
      (b) =>
        (!this.filterName ||
          b.name.toLowerCase().includes(this.filterName.toLowerCase())) &&
        (!this.filterOwner ||
          b.owner.toLowerCase().includes(this.filterOwner.toLowerCase())) &&
        (!this.filterPrivacy || b.privacy === this.filterPrivacy)
    );
  }

  goToBoard(id: string) {
    this.router.navigate(['/boards', id]);
  }

  showCreateBoardForm() {
    this.creatingBoard = true;
    this.newBoardName = '';
    this.newBoardPrivacy = 'private';
    setTimeout(() => {
      const input = document.querySelector<HTMLInputElement>(
        '.create-board-input'
      );
      input?.focus();
    });
  }

  cancelCreateBoard() {
    this.creatingBoard = false;
    this.newBoardName = '';
    this.newBoardPrivacy = 'private';
  }

  createBoard() {
    const name = this.newBoardName.trim();
    if (!name) return;
    // Генерируем id на основе времени, можно заменить на uuid
    const id = Date.now().toString();
    this.boards.push({
      id,
      name,
      owner: this.newBoardOwner,
      privacy: this.newBoardPrivacy,
    });
    this.creatingBoard = false;
    this.newBoardName = '';
    this.newBoardPrivacy = 'private';
    this.goToBoard(id);
  }
}
