import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BoardColumn } from '../../../../core/models/board-column.model';
import { BoardTask } from '../../../../core/models/board-task.model';
import { FormsModule } from '@angular/forms';
import {
  CdkDrag,
  CdkDropList,
  CdkDragHandle,
  CdkDropListGroup,
  CdkDragDrop,
} from '@angular/cdk/drag-drop';
import { BoardTaskComponent } from '../board-task/board-task.component';
import { TaskType } from '../../../../core/services/task-type.service';

@Component({
  selector: 'app-board-column',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    CdkDrag,
    CdkDropList,
    CdkDragHandle,
    CdkDropListGroup,
    BoardTaskComponent,
  ],
  templateUrl: './board-column.component.html',
  styleUrls: ['./board-column.component.scss'],
})
export class BoardColumnComponent {
  @Input() column!: BoardColumn;
  @Input() isDragging = false;
  @Input() addingTaskColumnId: string | null = null;
  @Input() connectedDropListsIds: string[] = [];
  @Input() getPriorityColor!: (priority: number) => string;
  @Input() getPriorityLabel!: (priority: number) => string;
  @Input() editing: boolean = false;
  @Input() editTitle: string = '';
  @Input() editColor: string = '#e3f2fd';
  @Input() editDescription: string = '';
  @Input() taskTypes: TaskType[] = [];

  @Output() editColumn = new EventEmitter<BoardColumn>();
  @Output() saveEditColumn = new EventEmitter<{
    id: string;
    title: string;
    color: string;
    description: string;
  }>();
  @Output() cancelEditColumn = new EventEmitter<void>();
  @Output() addTask = new EventEmitter<{
    column: BoardColumn;
    name: string;
    taskTypeId: string;
  }>();
  @Output() toggleAddTask = new EventEmitter<string>();
  @Output() cancelAddTask = new EventEmitter<void>();
  @Output() onTaskDrop = new EventEmitter<CdkDragDrop<BoardTask[]>>();
  @Output() openTaskDialog = new EventEmitter<BoardTask>();
  @Output() columnDragStarted = new EventEmitter<string>();
  @Output() columnDragEnded = new EventEmitter<void>();
  @Output() deleteColumn = new EventEmitter<BoardColumn>();

  newTaskName: string = '';
  selectedTaskTypeId: string = '';

  filteredTasks(col: BoardColumn) {
    return col.tasks;
  }

  emitAddTask() {
    const name = this.newTaskName?.trim();
    if (!name || !this.selectedTaskTypeId) return;
    this.addTask.emit({
      column: this.column,
      name,
      taskTypeId: this.selectedTaskTypeId,
    });
    this.newTaskName = '';
    this.selectedTaskTypeId = '';
  }
}
