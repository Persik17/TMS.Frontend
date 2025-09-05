import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { QuillModule } from 'ngx-quill';
import { TaskCommentsComponent } from '../../../task-shared/task-comments/task-comments.component';
import { TaskHistoryTabComponent } from '../../../task-shared/task-history-tab/task-history-tab.component';
import { TaskFilesTabComponent } from '../../../task-shared/task-files-tab/task-files-tab.component';
import {
  TaskService,
  TaskUpdateDto,
} from '../../../../core/services/task.service';
import { Task } from '../../../../core/models/task.model';
import { BoardService, UserDto } from '../../../../core/services/board.service';

@Component({
  selector: 'app-task-dialog',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    QuillModule,
    TaskCommentsComponent,
    TaskHistoryTabComponent,
    TaskFilesTabComponent,
  ],
  templateUrl: './task-dialog.component.html',
  styleUrls: ['./task-dialog.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class TaskDialogComponent implements OnInit {
  task: Task | null = null;
  userId: string = '';
  comments: any[] = [];
  changeHistory: any[] = [];
  attachedFiles: any[] = [];
  newCommentText = '';
  addingComment = false;
  activeTab: 'main' | 'history' | 'files' = 'main';
  boardUsers: UserDto[] = [];

  editingField: string | null = null;
  editValue: any = '';
  hoveredField: string | null = null;
  editTimer?: any;

  constructor(
    public dialogRef: MatDialogRef<TaskDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private taskService: TaskService,
    private boardService: BoardService
  ) {}

  ngOnInit() {
    const boardId = this.data.boardId || this.data.task?.boardId;
    const taskId = this.data.taskId || this.data.task?.id;
    this.userId = localStorage.getItem('userId') || '';

    if (boardId && this.userId) {
      const companyId = localStorage.getItem('companyId');
      if (companyId) {
        this.boardService
          .getBoardUsers(companyId, boardId, this.userId)
          .subscribe({
            next: (users) => {
              this.boardUsers = users;
            },
            error: () => {
              this.boardUsers = [];
            },
          });
      }
    }

    if (taskId && this.userId) {
      this.taskService.getTask(taskId, this.userId).subscribe({
        next: (task) => {
          this.task = { ...task };
        },
        error: () => {
          this.task = null;
        },
      });

      this.loadComments(taskId, this.userId);
    }

    this.changeHistory = this.data.changeHistory || [];
    this.attachedFiles = this.data.attachedFiles || [];
  }

  loadComments(taskId: string, userId: string) {
    this.taskService.getComments(taskId, userId).subscribe({
      next: (comments) => {
        this.comments = comments;
      },
      error: () => {
        this.comments = [];
      },
    });
  }

  setTab(tab: 'main' | 'history' | 'files') {
    this.activeTab = tab;
  }

  startEdit(field: string, value: any) {
    this.editingField = field;
    this.editValue = value ?? '';
    setTimeout(() => {
      const inp = document.querySelector<HTMLInputElement>(
        'input.editing-input, textarea.editing-input'
      );
      inp?.focus();
      inp?.select();
    }, 60);
  }

  cancelEdit() {
    this.editingField = null;
    this.editValue = '';
    this.hoveredField = null;
  }

  saveEdit(field: keyof TaskUpdateDto) {
    if (!this.task) return;
    const id = this.task.id;
    const userId = this.userId;

    const update: TaskUpdateDto = {
      id,
      name: this.task.name,
    };

    if (field === 'name') {
      update.name = this.editValue;
    }
    if (field === 'description' && this.editValue !== undefined)
      update.description = this.editValue;
    if (field === 'assigneeId')
      update.assigneeId =
        this.editValue !== null && this.editValue !== ''
          ? this.editValue
          : undefined;
    if (field === 'storyPoints' && this.editValue !== undefined)
      update.storyPoints = Number(this.editValue);
    if (field === 'priority' && this.editValue !== undefined)
      update.priority = Number(this.editValue);
    if (field === 'severity' && this.editValue !== undefined)
      update.severity = Number(this.editValue);

    this.taskService.updateTask(id, update, userId).subscribe({
      next: () => {
        (this.task as any)[field] = update[field];
        this.editingField = null;
        this.editValue = '';
        this.hoveredField = null;
      },
    });
  }

  addComment() {
    if (!this.newCommentText.trim() || !this.task) return;
    this.addingComment = true;
    const userId = localStorage.getItem('userId') || '';
    this.taskService
      .addComment(this.task.id, {
        text: this.newCommentText,
        authorId: userId,
      })
      .subscribe({
        next: (comment) => {
          this.comments.push(comment);
          this.newCommentText = '';
          this.addingComment = false;
        },
        error: () => {
          this.addingComment = false;
        },
      });
  }

  copyLink() {
    if (!this.task) return;
    const link =
      window.location.origin +
      `/boards/${this.task.boardId}/tasks/${this.task.id}`;
    navigator.clipboard.writeText(link);
  }

  openInPage() {
    if (!this.task) return;
    window.open(`/boards/${this.task.boardId}/tasks/${this.task.id}`, '_blank');
  }
}
