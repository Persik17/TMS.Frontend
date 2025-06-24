import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { BoardTask } from '../../models/board-column.model';
import { CommonModule } from '@angular/common';
import { QuillModule } from 'ngx-quill';

@Component({
  selector: 'app-task-dialog',
  standalone: true,
  imports: [CommonModule, FormsModule, QuillModule],
  templateUrl: './task-dialog.component.html',
  styleUrls: ['./task-dialog.component.scss'],
  encapsulation: ViewEncapsulation.None, // чтобы стили перекрывали mat-dialog
})
export class TaskDialogComponent implements OnInit {
  task: any;
  comments: any[] = [];
  changeHistory: any[] = [];
  attachedFiles: any[] = [];
  newCommentText = '';
  addingComment = false;
  activeTab: 'main' | 'history' | 'files' = 'main';

  editingField: string | null = null;
  editValue: any = '';

  quillModules = {
    toolbar: [
      ['bold', 'italic', 'underline', 'strike'],
      [{ color: [] }, { background: [] }],
      [{ header: [1, 2, 3, false] }],
      [{ list: 'ordered' }, { list: 'bullet' }],
      [{ align: [] }],
      ['clean'],
    ],
  };

  constructor(
    public dialogRef: MatDialogRef<TaskDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit() {
    this.task = this.data.task;
    this.comments = this.data.comments || [];
    this.changeHistory = this.data.changeHistory || [];
    this.attachedFiles = this.data.attachedFiles || [];
  }

  setTab(tab: 'main' | 'history' | 'files') {
    this.activeTab = tab;
  }

  startEdit(field: string, value: any) {
    this.editingField = field;
    if (field === 'dates') {
      this.editValue = {
        start: this.task?.startDate || '',
        end: this.task?.endDate || '',
      };
    } else {
      this.editValue = value;
    }
  }

  saveEdit(field: string) {
    if (!this.task) return;
    if (field === 'dates') {
      this.task.startDate = this.editValue.start;
      this.task.endDate = this.editValue.end;
    } else {
      (this.task as any)[field] = this.editValue;
    }
    this.editingField = null;
  }

  onEditValueChange(val: any) {
    this.editValue = val;
  }

  cancelEdit() {
    this.editingField = null;
  }

  addComment() {
    if (!this.newCommentText.trim()) return;
    this.addingComment = true;
    setTimeout(() => {
      this.comments.push({
        id: 'c' + Math.random(),
        text: this.newCommentText,
        creationDate: new Date().toISOString(),
        userId: 'currentUser',
        user: {
          id: 'currentUser',
          name: 'Вы',
          avatarUrl: 'https://i.pravatar.cc/36?u=me',
        },
        taskId: this.task.id,
      });
      this.newCommentText = '';
      this.addingComment = false;
    }, 800);
  }

  copyLink() {
    const link =
      window.location.origin +
      `/boards/${this.task.boardId}/tasks/${this.task.id}`;
    navigator.clipboard.writeText(link);
  }

  openInPage() {
    window.open(`/boards/${this.task.boardId}/tasks/${this.task.id}`, '_blank');
  }

  private getTaskComments(task: BoardTask) {
    return [
      {
        id: 'c1',
        text: 'Отличная задача, добавьте acceptance criteria!',
        creationDate: '2025-06-22T12:30:00Z',
        updateDate: null,
        deleteDate: null,
        userId: 'alice',
        user: {
          id: 'alice',
          name: 'Alice',
          avatarUrl: 'https://i.pravatar.cc/36?u=alice',
        },
        taskId: task.id,
      },
      {
        id: 'c2',
        text: 'Взял в работу',
        creationDate: '2025-06-23T08:00:00Z',
        updateDate: null,
        deleteDate: null,
        userId: 'bob',
        user: {
          id: 'bob',
          name: 'Bob',
          avatarUrl: 'https://i.pravatar.cc/36?u=bob',
        },
        taskId: task.id,
      },
    ];
  }
}
