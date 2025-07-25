import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { BoardService } from '../../core/services/board.service';
import { BoardStub } from '../../core/models/board.model';

@Component({
  selector: 'app-boards',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './boards.component.html',
  styleUrls: ['./boards.component.scss'],
})
export class BoardsComponent implements OnInit {
  boards: BoardStub[] = [];
  filterName = '';
  filterOwner = '';
  filterPrivacy: '' | 'private' | 'public' = '';

  creatingBoard = false;
  isCreatingBoard = false; // блокировка спама
  newBoardName = '';
  newBoardPrivacy: 'private' | 'public' = 'private';
  loading = true;
  error = '';

  constructor(private router: Router, private boardService: BoardService) {}

  ngOnInit() {
    const companyId = localStorage.getItem('companyId') || '';
    if (!companyId) {
      this.error = 'Компания не найдена';
      this.loading = false;
      return;
    }
    this.boardService.getBoards(companyId).subscribe({
      next: (boards) => {
        this.boards = boards;
        this.loading = false;
      },
      error: () => {
        this.error = 'Ошибка загрузки досок';
        this.loading = false;
      },
    });
  }

  get filteredBoards(): BoardStub[] {
    return this.boards.filter(
      (b) =>
        (!this.filterName ||
          b.name.toLowerCase().includes(this.filterName.toLowerCase())) &&
        (!this.filterOwner ||
          (b.headFullName ?? '')
            .toLowerCase()
            .includes(this.filterOwner.toLowerCase())) &&
        (!this.filterPrivacy ||
          (this.filterPrivacy === 'private' ? b.isPrivate : !b.isPrivate))
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
    this.isCreatingBoard = false;
  }

  createBoard() {
    const name = this.newBoardName.trim();
    if (!name || this.isCreatingBoard) return;
    const companyId = localStorage.getItem('companyId') || '';
    if (!companyId) {
      this.error = 'Компания не найдена';
      return;
    }
    this.isCreatingBoard = true;
    this.boardService
      .createBoard(companyId, name, this.newBoardPrivacy)
      .subscribe({
        next: (board) => {
          this.boards.push(board);
          this.creatingBoard = false;
          this.newBoardName = '';
          this.newBoardPrivacy = 'private';
          this.isCreatingBoard = false;
          this.goToBoard(board.id);
        },
        error: () => {
          this.error = 'Ошибка создания доски';
          this.isCreatingBoard = false;
        },
      });
  }
}
