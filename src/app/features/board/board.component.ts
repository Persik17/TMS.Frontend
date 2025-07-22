import { Component, OnInit } from '@angular/core';
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
import { BoardService, BoardInfoDto, BoardTaskType } from '../../core/services/board.service';
import { ActivatedRoute } from '@angular/router';
import { TaskDialogComponent } from './dialogs/task-dialog/task-dialog.component';

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
export class BoardComponent implements OnInit {
  constructor(
    private dialog: MatDialog,
    private route: ActivatedRoute,
    private boardService: BoardService
  ) {}

  editingColumnId: string | null = null;
  editColumnTitle: string = '';
  editColumnColor: string = '#e3f2fd';

  tab: 'board' | 'burn' = 'board';

  columns: BoardColumn[] = [];
  taskTypes: BoardTaskType[] = [];
  connectedDropListsIds: string[] = [];
  addingTaskColumnId: string | null = null;
  newTaskName = '';
  addingColumn = false;
  newColumnTitle = '';
  newColumnColor = '#e3f2fd';
  isDraggingColumnId: string | null = null;

  loading = true;
  error = '';
  boardId: string = '';
  companyId: string = '';

  ngOnInit() {
    this.boardId = this.route.snapshot.paramMap.get('id') || '';
    this.companyId = localStorage.getItem('companyId') || '';
    if (!this.boardId || !this.companyId) {
      this.error = 'Доска или компания не найдена';
      this.loading = false;
      return;
    }
    this.boardService.getBoardInfo(this.companyId, this.boardId).subscribe({
      next: (info: BoardInfoDto) => {
        this.columns = info.columns;
        this.taskTypes = info.taskTypes;
        this.connectedDropListsIds = this.columns.map((col) => col.id);
        this.loading = false;
      },
      error: () => {
        this.error = 'Ошибка загрузки данных доски';
        this.loading = false;
      },
    });
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
      data: {
        task: task,
        comments: task.comments || [],
        changeHistory: task.changeHistory || [],
        attachedFiles: task.attachedFiles || [],
      },
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
  }

  onTaskDrop(event: CdkDragDrop<BoardTask[]>, targetCol: BoardColumn) {
    if (event.previousContainer === event.container) {
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    } else {
      const task: BoardTask = event.previousContainer.data[event.previousIndex];
      task.loading = true;
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
      setTimeout(() => {
        task.columnId = targetCol.id;
        task.loading = false;
      }, 800);
    }
  }

  toggleAddTask(colId: string) {
    if (this.addingTaskColumnId === colId) {
      this.cancelAddTask();
    } else {
      this.addingTaskColumnId = colId;
      this.newTaskName = '';
      setTimeout(() => {
        const input = document.querySelector<HTMLInputElement>(
          '.add-task-form input'
        );
        input?.focus();
      });
    }
  }

  cancelAddTask() {
    this.addingTaskColumnId = null;
    this.newTaskName = '';
  }

  addTask(col: BoardColumn) {
    const name = this.newTaskName.trim();
    if (!name) return;
    const id = Date.now().toString();
    const newTask: BoardTask = {
      id,
      name,
      description: '',
      assigneeId: '',
      startDate: new Date().toISOString(),
      endDate: null,
      storyPoints: 0,
      priority: 0,
      columnId: col.id,
      loading: false,
      comments: [],
      changeHistory: [],
      attachedFiles: [],
    };
    col.tasks.unshift(newTask);
    this.cancelAddTask();
  }

  showAddColumnForm() {
    this.addingColumn = true;
    this.newColumnTitle = '';
    this.newColumnColor = '#e3f2fd';
    setTimeout(() => {
      const input = document.querySelector<HTMLInputElement>('.add-col-input');
      input?.focus();
    });
  }
  cancelAddColumn() {
    this.addingColumn = false;
    this.newColumnTitle = '';
    this.newColumnColor = '#e3f2fd';
  }
  addColumn() {
    const title = this.newColumnTitle.trim();
    if (!title) return;
    const color = this.newColumnColor || '#e3f2fd';
    const id = Date.now().toString();
    const order = this.columns.length;

    this.columns.push({
      id,
      title,
      color,
      order,
      tasks: [],
    });
    this.connectedDropListsIds = this.columns.map((col) => col.id);
    this.cancelAddColumn();
  }

  onColumnDrop(event: CdkDragDrop<any[]>) {
    if (event.previousIndex === event.currentIndex) return;
    moveItemInArray(this.columns, event.previousIndex, event.currentIndex);
    this.columns.forEach((col, idx) => (col.order = idx));
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
