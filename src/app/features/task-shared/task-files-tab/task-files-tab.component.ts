import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TaskFile } from '../../../core/models/task-file.model';

@Component({
  selector: 'app-task-files-tab',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './task-files-tab.component.html',
  styleUrls: ['./task-files-tab.component.scss'],
})
export class TaskFilesTabComponent {
  @Input() attachedFiles: TaskFile[] = [];
}
