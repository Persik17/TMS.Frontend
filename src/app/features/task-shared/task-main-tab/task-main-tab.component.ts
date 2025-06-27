import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { QuillModule } from 'ngx-quill';
import { CommonModule } from '@angular/common';
import { Task } from '../../../core/models/task.model';

@Component({
  selector: 'app-task-main-tab',
  standalone: true,
  imports: [CommonModule, FormsModule, QuillModule],
  templateUrl: './task-main-tab.component.html',
  styleUrls: ['./task-main-tab.component.scss'],
})
export class TaskMainTabComponent {
  @Input() task!: Task;
  @Input() editingField!: string | null;
  @Input() editValue: any;
  @Input() quillModules: any;

  @Output() startEdit = new EventEmitter<{ field: string; value: any }>();
  @Output() saveEdit = new EventEmitter<string>();
  @Output() onEditValueChange = new EventEmitter<any>();
  @Output() cancelEdit = new EventEmitter<void>();
}
