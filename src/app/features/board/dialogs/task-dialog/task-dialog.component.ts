import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { QuillModule } from 'ngx-quill';
import { TaskMainTabComponent } from '../../../task-shared/task-main-tab/task-main-tab.component';
import { TaskHistoryTabComponent } from '../../../task-shared/task-history-tab/task-history-tab.component';
import { TaskFilesTabComponent } from '../../../task-shared/task-files-tab/task-files-tab.component';
import { TaskCommentsComponent } from '../../../task-shared/task-comments/task-comments.component';

@Component({
  selector: 'app-task-dialog',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    QuillModule,
    TaskMainTabComponent,
    TaskHistoryTabComponent,
    TaskFilesTabComponent,
    TaskCommentsComponent,
  ],
  templateUrl: './task-dialog.component.html',
  styleUrls: ['./task-dialog.component.scss'],
  encapsulation: ViewEncapsulation.None,
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
}
