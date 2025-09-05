import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import {
  TaskService,
  TaskUpdateDto,
} from '../../../core/services/task.service';
import { Task } from '../../../core/models/task.model';
import { Comment } from '../../../core/models/comment.model';
import { Clipboard } from '@angular/cdk/clipboard';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { QuillModule } from 'ngx-quill';
import { TaskFile } from '../../../core/models/task-file.model';
import { BoardService, UserDto } from '../../../core/services/board.service';
import { TaskCommentsComponent } from '../../task-shared/task-comments/task-comments.component';

@Component({
  selector: 'app-task-page',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    QuillModule,
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

  attachedFiles: TaskFile[] = [];
  error: string | null = null;
  userId: string = '';
  taskId: string = '';
  boardUsers: UserDto[] = [];

  constructor(
    private route: ActivatedRoute,
    private taskService: TaskService,
    private boardService: BoardService,
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
        if (task.boardId) {
          console.log(task);
          const companyId = localStorage.getItem('companyId');
          if (companyId) {
            this.boardService
              .getBoardUsers(companyId, task.boardId, this.userId)
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
        this.loadComments(this.taskId, this.userId);
        this.loadFiles(this.taskId, this.userId);
      },
      error: () => {
        this.error = 'Задача не найдена';
        this.loading = false;
      },
    });
  }

  loadFiles(taskId: string, userId: string) {
    this.taskService.getTaskFiles(taskId, userId).subscribe({
      next: (files) => {
        this.attachedFiles = files;
      },
      error: () => {
        this.attachedFiles = [];
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
      const inp = document.querySelector<HTMLInputElement | HTMLSelectElement>(
        'input.editing-input, textarea.editing-input, select.editing-input'
      );
      inp?.focus();
      // @ts-ignore
      inp?.select?.();
    }, 60);
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
    if (field === 'assigneeId') update.assigneeId = this.editValue || null;
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

  cancelEdit() {
    this.editingField = null;
    this.editValue = '';
    this.hoveredField = null;
  }

  autoSave(field: keyof TaskUpdateDto) {
    if (!this.task) return;
    const id = this.task.id;
    if (!id) return;

    if (this.editTimer) clearTimeout(this.editTimer);
    this.editTimer = setTimeout(() => {
      let newName = this.task?.name ?? '';
      if (field === 'name') {
        newName = this.editValue;
      }

      const update: TaskUpdateDto = { id, name: newName };

      if (field === 'assigneeId') {
        if (this.editValue !== null && this.editValue !== '') {
          update.assigneeId = this.editValue;
        } else {
          update.assigneeId = undefined;
        }
      } else if (
        field === 'storyPoints' ||
        field === 'priority' ||
        field === 'severity'
      ) {
        if (this.editValue !== null && this.editValue !== '') {
          update[field] = Number(this.editValue);
        }
      } else if (field !== 'name') {
        update[field] = this.editValue;
      }

      this.taskService.updateTask(id, update, this.userId).subscribe({
        next: () => {
          if (update[field] !== undefined) {
            (this.task as any)[field] = update[field];
          } else if (field === 'assigneeId') {
            (this.task as any).assigneeId = null;
          }
          if (field === 'name') {
            this.task!.name = newName;
          }
          this.editingField = null;
          this.editValue = '';
        },
      });
    }, 700);
  }
}
