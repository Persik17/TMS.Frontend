import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { TaskService } from '../../../core/services/task.service';
import { Task } from '../../../core/models/task.model';
import { Comment } from '../../../core/models/comment.model';
import { Clipboard } from '@angular/cdk/clipboard';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { QuillModule } from 'ngx-quill';
import { TaskMainTabComponent } from '../../task-shared/task-main-tab/task-main-tab.component';
import { TaskHistoryTabComponent } from '../../task-shared/task-history-tab/task-history-tab.component';
import { TaskFilesTabComponent } from '../../task-shared/task-files-tab/task-files-tab.component';
import { TaskCommentsComponent } from '../../task-shared/task-comments/task-comments.component';

@Component({
  selector: 'app-task-page',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    QuillModule,
    TaskMainTabComponent,
    TaskHistoryTabComponent,
    TaskFilesTabComponent,
    TaskCommentsComponent,
  ],
  templateUrl: './task-page.component.html',
  styleUrls: ['./task-page.component.scss'],
})
export class TaskPageComponent implements OnInit {
  task: Task | null = null;
  loading = true;
  comments: Comment[] = [];
  newCommentText = '';
  addingComment = false;
  activeTab: 'main' | 'history' | 'files' = 'main';
  editingField: string | null = null;
  editValue: any = '';
  hoveredField: string | null = null;
  editTimer?: any;

  changeHistory = [];
  attachedFiles = [];

  error: string | null = null;
  userId: string = '';
  taskId: string = '';

  constructor(
    private route: ActivatedRoute,
    private taskService: TaskService,
    private clipboard: Clipboard,
    private router: Router
  ) {}

  ngOnInit() {
    const idFromRoute = this.route.snapshot.paramMap.get('id');
    const taskIdFromRoute = this.route.snapshot.paramMap.get('taskId');
    this.taskId = taskIdFromRoute || idFromRoute || '';

    if (!this.taskId) {
      this.error = 'Некорректная задача (нет id в роутах)';
      this.loading = false;
      return;
    }

    const userId = localStorage.getItem('userId');
    if (!userId) {
      this.error = 'Пользователь не найден';
      this.loading = false;
      return;
    }
    this.userId = userId;

    this.taskService.getTask(this.taskId, this.userId).subscribe({
      next: (task) => {
        this.task = task;
        this.loading = false;
        this.loadComments(this.taskId, this.userId);
      },
      error: () => {
        this.error = 'Задача не найдена';
        this.loading = false;
      },
    });
  }

  get taskUrl(): string {
    if (!this.task) return '';
    return `${window.location.origin}/tasks/${this.task.id}`;
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

  addComment() {
    if (!this.newCommentText.trim() || !this.task) return;
    this.addingComment = true;
    this.taskService
      .addComment(this.task.id, {
        text: this.newCommentText,
        authorId: this.userId,
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
    this.clipboard.copy(this.taskUrl);
  }

  backToBoard() {
    if (!this.task || !this.task.boardId) {
      this.router.navigate(['/my-tasks']);
    } else {
      this.router.navigate(['/boards', this.task.boardId]);
    }
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

  saveEdit(field: string) {
    if (!this.task) return;
    const id = this.task.id;
    (this.task as any)[field] = this.editValue;
    this.taskService
      .updateTask(id, { [field]: this.editValue }, this.userId)
      .subscribe();
    this.editingField = null;
    this.editValue = '';
    this.hoveredField = null;
  }

  cancelEdit() {
    this.editingField = null;
    this.editValue = '';
    this.hoveredField = null;
  }

  autoSave(field: string) {
    if (!this.task) return;
    const id = this.task.id;
    if (this.editTimer) clearTimeout(this.editTimer);
    this.editTimer = setTimeout(() => {
      (this.task as any)[field] = this.editValue;
      this.taskService
        .updateTask(id, { [field]: this.editValue }, this.userId)
        .subscribe();
      this.editingField = null;
      this.editValue = '';
    }, 700);
  }
}
