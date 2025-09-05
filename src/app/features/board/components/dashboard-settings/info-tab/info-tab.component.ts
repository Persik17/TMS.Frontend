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
export class InfoTabComponent implements OnChanges {
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
    this.error = '';
    const companyId = this.board.companyId || localStorage.getItem('companyId');
    if (!companyId || !this.board.id) {
      this.error = 'Некорректные идентификаторы доски или компании!';
      return;
    }
    this.saving = true;
    this.boardService
      .updateBoard(companyId, {
        id: this.board.id,
        name: this.editName,
        description: this.editDescription,
        companyId: companyId,
        headFullName: this.board.headFullName ?? '',
        boardType: this.board.boardType,
        isPrivate: this.editIsPrivate,
        creationDate: this.board.creationDate,
        updateDate: this.board.updateDate || undefined,
        deleteDate: this.board.deleteDate || undefined,
      })
      .subscribe({
        next: () => {
          this.board.name = this.editName;
          this.board.description = this.editDescription;
          this.board.isPrivate = this.editIsPrivate;
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
