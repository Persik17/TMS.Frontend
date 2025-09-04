import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TaskFile } from '../../../core/models/task-file.model';
import { TaskService } from '../../../core/services/task.service';

@Component({
  selector: 'app-task-files-tab',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './task-files-tab.component.html',
  styleUrls: ['./task-files-tab.component.scss'],
})
export class TaskFilesTabComponent {
  @Input() attachedFiles: TaskFile[] = [];
  @Input() taskId!: string;
  @Input() userId!: string;
  uploading = false;

  constructor(private taskService: TaskService) {}

  onFileChange(event: Event) {
    if (!this.taskId || !this.userId) {
      alert(this.taskId || ' и ' || this.userId);
      return;
    }
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.uploading = true;
      const file = input.files[0];
      this.taskService
        .uploadTaskFile(this.taskId, file, this.userId)
        .subscribe({
          next: () => {
            this.uploading = false;
          },
          error: () => (this.uploading = false),
        });
      input.value = '';
    }
  }

  deleteFile(fileId: string) {
    if (!confirm('Удалить файл?')) return;
    this.taskService
      .deleteTaskFile(this.taskId, fileId, this.userId)
      .subscribe();
  }

  formatSize(size?: number): string {
    if (size == null) return '';
    if (size < 1024) return `${size} Б`;
    if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} КБ`;
    return `${(size / (1024 * 1024)).toFixed(1)} МБ`;
  }
}
