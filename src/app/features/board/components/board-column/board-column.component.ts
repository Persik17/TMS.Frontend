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
  @Input() newTaskName: string = '';
  @Input() connectedDropListsIds: string[] = [];
  @Input() getPriorityColor!: (priority: number) => string;
  @Input() getPriorityLabel!: (priority: number) => string;

  @Output() editColumn = new EventEmitter<BoardColumn>();
  @Output() addTask = new EventEmitter<BoardColumn>();
  @Output() toggleAddTask = new EventEmitter<string>();
  @Output() cancelAddTask = new EventEmitter<void>();
  @Output() onTaskDrop = new EventEmitter<CdkDragDrop<BoardTask[]>>();
  @Output() openTaskDialog = new EventEmitter<BoardTask>();
  @Output() columnDragStarted = new EventEmitter<string>();
  @Output() columnDragEnded = new EventEmitter<void>();

  filteredTasks(col: BoardColumn) {
    return col.tasks;
  }
}
