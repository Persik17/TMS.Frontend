import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { TaskService } from '../../../services/task.service';
import { Task } from '../../../models/task.model';
import { Comment } from '../../../models/comment.model';
import { Clipboard } from '@angular/cdk/clipboard';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { QuillModule } from 'ngx-quill';

@Component({
  selector: 'app-task-page',
  imports: [CommonModule, FormsModule, RouterModule, QuillModule],
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
    this.taskService.getTask(boardId, taskId).subscribe((task) => {
      this.task = task;
      this.loading = false;
    });
    this.loadComments(taskId);
  }

  get taskUrl(): string {
    if (!this.task) return '';
    return `${window.location.origin}/boards/${this.task.boardId}/tasks/${this.task.id}`;
  }

  loadComments(taskId: string) {
    this.comments = [
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
        taskId,
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
        taskId,
      },
    ];
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

  addComment() {
    if (!this.newCommentText.trim() || !this.task) return;
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
        taskId: this.task!.id,
      });
      this.newCommentText = '';
      this.addingComment = false;
    }, 800);
  }

  setTab(tab: 'main' | 'history' | 'files') {
    this.activeTab = tab;
  }

  startEdit(field: string, value: any) {
    this.editingField = field;
    if (field === 'dates') {
      // value может быть строкой или объектом, но мы всегда делаем editValue объектом
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
