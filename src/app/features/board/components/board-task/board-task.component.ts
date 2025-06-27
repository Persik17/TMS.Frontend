import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BoardTask } from '../../../../core/models/board-task.model';
import { CdkDrag } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-board-task',
  standalone: true,
  imports: [CommonModule, CdkDrag],
  templateUrl: './board-task.component.html',
  styleUrls: ['./board-task.component.scss'],
})
export class BoardTaskComponent {
  @Input() task!: BoardTask;
  @Input() getPriorityColor!: (priority: number) => string;
  @Input() getPriorityLabel!: (priority: number) => string;
  @Output() openTask = new EventEmitter<BoardTask>();

  onClick() {
    this.openTask.emit(this.task);
  }
}
