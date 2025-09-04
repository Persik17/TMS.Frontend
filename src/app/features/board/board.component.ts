import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  DragDropModule,
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';
import { FormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { BoardAnalyticsComponent } from './analytics/board-analytics/board-analytics.component';
import { BoardColumnComponent } from './components/board-column/board-column.component';
import { BoardTask } from '../../core/models/board-task.model';
import { BoardColumn } from '../../core/models/board-column.model';
import {
  BoardService,
  BoardInfoDto,
  BoardTaskType,
} from '../../core/services/board.service';
import { ActivatedRoute } from '@angular/router';
import { TaskDialogComponent } from './dialogs/task-dialog/task-dialog.component';
import { TaskCreateDto, TaskService } from '../../core/services/task.service';
import { TaskTypeService } from '../../core/services/task-type.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-board',
  standalone: true,
  imports: [
    CommonModule,
    DragDropModule,
    FormsModule,
    BoardAnalyticsComponent,
    BoardColumnComponent,
  ],
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss'],
})
export class BoardComponent implements OnInit, OnDestroy {
  private routeSub?: Subscription;

  constructor(
    private dialog: MatDialog,
    private route: ActivatedRoute,
    private boardService: BoardService,
    private taskService: TaskService,
    private taskTypeService: TaskTypeService
  ) {}

  editingColumnId: string | null = null;
  editColumnTitle: string = '';
  editColumnColor: string = '#e3f2fd';
  editColumnDescription: string = '';

  tab: 'board' | 'burn' = 'board';

  columns: BoardColumn[] = [];
  taskTypes: BoardTaskType[] = [];
  connectedDropListsIds: string[] = [];
  addingTaskColumnId: string | null = null;
  newTaskName = '';
  addingColumn = false;
  newColumnTitle = '';
  newColumnDescription = '';
  newColumnColor = '#e3f2fd';
  isDraggingColumnId: string | null = null;

  loading = true;
  error = '';
  boardId: string = '';
  companyId: string = '';

  ngOnInit() {
    this.routeSub = this.route.paramMap.subscribe((params) => {
      const newBoardId = params.get('id') || '';
      this.boardId = newBoardId;
      this.companyId = localStorage.getItem('companyId') || '';
      const userId = localStorage.getItem('userId') || '';
      if (!this.boardId || !this.companyId) {
        this.error = 'Доска или компания не найдена';
        this.loading = false;
        return;
      }
      this.loading = true;
      this.boardService.getBoardInfo(this.companyId, this.boardId).subscribe({
        next: (info: BoardInfoDto) => {
          this.columns = info.columns;
          this.connectedDropListsIds = this.columns.map((col) => col.id);
          this.loading = false;
        },
        error: () => {
          this.error = 'Ошибка загрузки данных доски';
          this.loading = false;
        },
      });

      this.taskTypeService
        .getTaskTypesByBoardId(this.boardId, userId)
        .subscribe({
          next: (types) => {
            this.taskTypes = types;
          },
          error: () => {
            this.taskTypes = [];
          },
        });
    });
  }

  ngOnDestroy() {
    this.routeSub?.unsubscribe();
  }

  get sortedColumns() {
    return [...this.columns].sort((a, b) => a.order - b.order);
  }

  openTaskDialog(task: BoardTask) {
    this.dialog.open(TaskDialogComponent, {
      width: '90vw',
      maxWidth: '98vw',
      height: '90vh',
      maxHeight: '98vh',
      data: { task },
      autoFocus: false,
      restoreFocus: false,
      panelClass: 'task-dialog-panel',
    });
  }

  getPriorityColor(priority: number): string {
    switch (priority) {
      case 1:
        return '#ff5252'; // высокий
      case 2:
        return '#ff9800'; // средний
      case 3:
        return '#4caf50'; // низкий
      default:
        return '#bdbdbd';
    }
  }

  getPriorityLabel(priority: number): string {
    switch (priority) {
      case 1:
        return 'Высокий';
      case 2:
        return 'Средний';
      case 3:
        return 'Низкий';
      default:
        return 'Нет';
    }
  }

  editColumn(col: BoardColumn) {
    this.editingColumnId = col.id;
    this.editColumnTitle = col.title;
    this.editColumnColor = col.color;
    this.editColumnDescription = col.description ?? '';
  }

  cancelEditColumn() {
    this.editingColumnId = null;
    this.editColumnTitle = '';
    this.editColumnColor = '#e3f2fd';
    this.editColumnDescription = '';
  }

  saveEditColumn(data: {
    id: string;
    title: string;
    color: string;
    description: string;
  }) {
    const idx = this.columns.findIndex((c) => c.id === data.id);
    if (idx < 0) return;
    const col = {
      ...this.columns[idx],
      title: data.title,
      color: data.color,
      description: data.description,
    };
    this.boardService
      .updateColumn(this.companyId, this.boardId, col)
      .subscribe((updated) => {
        this.columns[idx] = updated;
        this.cancelEditColumn();
      });
  }

  deleteColumn(col: BoardColumn) {
    this.boardService
      .deleteColumn(this.companyId, this.boardId, col.id)
      .subscribe(() => {
        this.columns = this.columns.filter((c) => c.id !== col.id);
        this.connectedDropListsIds = this.columns.map((col) => col.id);
      });
  }

  onTaskDrop(event: CdkDragDrop<BoardTask[]>, targetCol: BoardColumn) {
    if (event.previousContainer === event.container) {
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    } else {
      const userId = localStorage.getItem('userId') || '';
      const task: BoardTask = event.previousContainer.data[event.previousIndex];
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
      task.columnId = targetCol.id;
      this.taskService
        .moveTaskToColumn(task.id, targetCol.id, userId)
        .subscribe();
    }
  }

  toggleAddTask(colId: string) {
    if (this.addingTaskColumnId === colId) {
      this.cancelAddTask();
    } else {
      this.addingTaskColumnId = colId;
      this.newTaskName = '';
      const input = document.querySelector<HTMLInputElement>(
        '.add-task-form input'
      );
      queueMicrotask(() => input?.focus());
    }
  }

  cancelAddTask() {
    this.addingTaskColumnId = null;
    this.newTaskName = '';
  }

  addTask(event: { column: BoardColumn; name: string; taskTypeId: string }) {
    const name = event.name?.trim();
    if (!name) return;

    const col = event.column;
    const taskTypeId = event.taskTypeId;
    const userId = localStorage.getItem('userId') || '';
    const boardId = this.boardId;
    const creatorId = userId;
    const assigneeId = userId;
    const columnId = col.id;

    const newTask: TaskCreateDto = {
      name,
      boardId,
      creatorId,
      assigneeId,
      taskTypeId,
      columnId,
    };

    this.taskService.createTask(newTask, userId).subscribe({
      next: (created: BoardTask) => {
        col.tasks.unshift({ ...created, loading: false });
        this.cancelAddTask();
      },
      error: (err) => {
        console.error('Error creating task:', err);
      },
    });
  }

  deleteTask(task: BoardTask) {
    const userId = localStorage.getItem('userId') || '';
    this.taskService.deleteTask(task.id, userId).subscribe(() => {
      const col = this.columns.find((c) => c.id === task.columnId);
      if (col) {
        col.tasks = col.tasks.filter((t) => t.id !== task.id);
      }
    });
  }

  showAddColumnForm() {
    this.addingColumn = true;
    this.newColumnTitle = '';
    this.newColumnDescription = '';
    this.newColumnColor = '#e3f2fd';
    queueMicrotask(() => {
      const input = document.querySelector<HTMLInputElement>('.add-col-input');
      input?.focus();
    });
  }

  cancelAddColumn() {
    this.addingColumn = false;
    this.newColumnTitle = '';
    this.newColumnDescription = '';
    this.newColumnColor = '#e3f2fd';
  }

  addColumn() {
    const title = this.newColumnTitle.trim();
    const description = this.newColumnDescription.trim();
    if (!title || !description) return;
    const color = this.newColumnColor || '#e3f2fd';
    const order = this.columns.length;

    this.loading = true;
    this.boardService
      .addColumn(this.companyId, this.boardId, title, description, order, color)
      .subscribe({
        next: (newCol) => {
          this.columns.push(newCol);
          this.connectedDropListsIds = this.columns.map((col) => col.id);
          this.cancelAddColumn();
          this.loading = false;
        },
        error: () => {
          this.error = 'Ошибка создания столбца';
          this.loading = false;
        },
      });
  }

  onColumnDrop(event: CdkDragDrop<BoardColumn[]>) {
    if (event.previousIndex === event.currentIndex) return;
    moveItemInArray(this.columns, event.previousIndex, event.currentIndex);
    this.columns.forEach((col, idx) => (col.order = idx));
    this.boardService
      .updateColumnOrder(this.companyId, this.boardId, this.columns)
      .subscribe({
        next: () => {
          this.boardService
            .getBoardInfo(this.companyId, this.boardId)
            .subscribe({
              next: (info) => {
                this.columns = info.columns;
                this.connectedDropListsIds = this.columns.map((col) => col.id);
              },
            });
        },
      });
  }

  onColumnDragStarted(colId: string) {
    this.isDraggingColumnId = colId;
  }

  onColumnDragEnded() {
    this.isDraggingColumnId = null;
  }

  trackByColId(index: number, col: BoardColumn) {
    return col.id;
  }
}
