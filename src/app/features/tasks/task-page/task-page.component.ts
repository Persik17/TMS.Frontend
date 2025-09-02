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

  changeHistory = [
    {
      date: '2025-06-21T14:30:00Z',
      text: 'Изменён исполнитель: user2 → user3',
      user: 'Bob',
    },
    {
      date: '2025-06-22T08:00:00Z',
      text: 'Обновлено описание задачи',
      user: 'Alice',
    },
  ];

  attachedFiles = [
    {
      name: 'specs.pdf',
      url: '/files/specs.pdf',
      size: '120 KB',
      date: '2025-06-20',
    },
    {
      name: 'design.png',
      url: '/files/design.png',
      size: '340 KB',
      date: '2025-06-19',
    },
  ];

  constructor(
    private route: ActivatedRoute,
    private taskService: TaskService,
    private clipboard: Clipboard,
    private router: Router
  ) {}

  ngOnInit() {
    const boardId = this.route.snapshot.paramMap.get('boardId')!;
    const taskId = this.route.snapshot.paramMap.get('taskId')!;
    const userId = localStorage.getItem('userId') || '';

    this.taskService.getTask(taskId, userId).subscribe({
      next: (task) => {
        this.task = {
          ...task,
          name: task.name,
        };
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      },
    });

    this.loadComments(taskId, userId);
  }

  get taskUrl(): string {
    if (!this.task) return '';
    return `${window.location.origin}/boards/${this.task.boardId}/tasks/${this.task.id}`;
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
          // обработка ошибки
          this.addingComment = false;
        },
      });
  }

  copyLink() {
    if (!this.task) return;
    const link = this.taskUrl;
    this.clipboard.copy(link);
  }

  backToBoard() {
    if (!this.task) return;
    this.router.navigate(['/boards', this.task.boardId]);
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
}
