import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Board } from '../../../../../core/models/board.model';
import { BoardService } from '../../../../../core/services/board.service';

@Component({
  selector: 'app-dashboard-settings-info-tab',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './info-tab.component.html',
  styleUrls: ['./info-tab.component.scss'],
})
export class DashboardSettingsInfoTabComponent implements OnChanges {
  @Input() board!: Board;

  editing = false;
  editName = '';
  editDescription = '';
  editIsPrivate = false;
  saving = false;
  error = '';

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['board'] && this.board && !this.editing) {
      this.editName = this.board.name;
      this.editDescription = this.board.description;
      this.editIsPrivate = this.board.isPrivate;
    }
  }

  constructor(private boardService: BoardService) {}

  startEdit() {
    this.editing = true;
    this.editName = this.board.name;
    this.editDescription = this.board.description;
    this.editIsPrivate = this.board.isPrivate;
    this.error = '';
  }

  cancelEdit() {
    this.editing = false;
    this.editName = this.board.name;
    this.editDescription = this.board.description;
    this.editIsPrivate = this.board.isPrivate;
    this.error = '';
  }

  saveEdit() {
    this.saving = true;
    const companyId = this.board.companyId;
    this.boardService
      .updateBoard(companyId, {
        ...this.board,
        name: this.editName,
        description: this.editDescription,
        isPrivate: this.editIsPrivate,
      })
      .subscribe({
        next: (updated) => {
          this.board.name = updated.name;
          this.board.description = updated.description;
          this.board.isPrivate = updated.isPrivate;
          this.editing = false;
          this.saving = false;
        },
        error: () => {
          this.error = 'Ошибка сохранения. Попробуйте ещё раз.';
          this.saving = false;
        },
      });
  }
}
