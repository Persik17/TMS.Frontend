import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  DragDropModule,
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';
import { FormsModule } from '@angular/forms';
import { TaskDialogComponent } from './dialogs/task-dialog/task-dialog.component';
import { BoardAnalyticsComponent } from './analytics/board-analytics/board-analytics.component';
import { MatDialog } from '@angular/material/dialog';

type BoardTask = {
  id: string;
  name: string;
  description: string;
  assigneeId: string;
  startDate: string;
  endDate: string | null;
  storyPoints: number;
  priority: number;
  columnId: string;
  loading: boolean;
};

type BoardColumn = {
  id: string;
  title: string;
  color: string;
  order: number;
  tasks: BoardTask[];
};

@Component({
  selector: 'app-board',
  standalone: true,
  imports: [CommonModule, DragDropModule, FormsModule, BoardAnalyticsComponent],
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss'],
})
export class BoardComponent implements OnInit {
  constructor(private dialog: MatDialog) {}

  editingColumnId: string | null = null;
  editColumnTitle: string = '';
  editColumnColor: string = '#e3f2fd';

  tab: 'board' | 'burn' = 'board';

  columns: BoardColumn[] = [];
  connectedDropListsIds: string[] = [];
  addingTaskColumnId: string | null = null;
  newTaskName = '';
  addingColumn = false;
  newColumnTitle = '';
  newColumnColor = '#e3f2fd';
  isDraggingColumnId: string | null = null;

  ngOnInit() {
    const allTasks: BoardTask[] = [
      {
        id: '1',
        name: 'Сделать дизайн',
        description: 'Подготовить макеты для главной страницы.',
        assigneeId: 'alice',
        startDate: '2025-06-20',
        endDate: '2025-06-25',
        storyPoints: 5,
        priority: 2,
        columnId: 'todo',
        loading: false,
      },
      {
        id: '2',
        name: 'Верстка',
        description: 'Сделать адаптивную верстку.',
        assigneeId: 'bob',
        startDate: '2025-06-21',
        endDate: '2025-06-27',
        storyPoints: 8,
        priority: 1,
        columnId: 'in-progress',
        loading: false,
      },
      {
        id: '3',
        name: 'Тестирование',
        description: 'Провести тестирование.',
        assigneeId: 'charlie',
        startDate: '2025-06-23',
        endDate: '2025-06-29',
        storyPoints: 3,
        priority: 3,
        columnId: 'done',
        loading: false,
      },
    ];

    this.columns = [
      {
        id: 'todo',
        title: 'К выполнению',
        color: '#e3f2fd',
        tasks: allTasks.filter((t) => t.columnId === 'todo'),
        order: 1,
      },
      {
        id: 'in-progress',
        title: 'В работе',
        color: '#fffde7',
        tasks: allTasks.filter((t) => t.columnId === 'in-progress'),
        order: 2,
      },
      {
        id: 'done',
        title: 'Готово',
        color: '#e8f5e9',
        tasks: allTasks.filter((t) => t.columnId === 'done'),
        order: 3,
      },
    ];
    this.connectedDropListsIds = this.columns.map((col) => col.id);
  }

  get sortedColumns() {
    return [...this.columns].sort((a, b) => a.order - b.order);
  }

  openTaskDialog(task: any) {
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
    // Открой форму редактирования столбца, например:
    this.editingColumnId = col.id;
    this.editColumnTitle = col.title;
    this.editColumnColor = col.color;
  }

  getDaysForSprint(): string[] {
    const days: string[] = [];
    let d = new Date();
    for (let i = 0; i < 7; i++) {
      const dd = new Date(d.getTime());
      dd.setDate(d.getDate() + i);
      days.push(
        dd.toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit' })
      );
    }
    return days;
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

  filteredTasks(col: BoardColumn): BoardTask[] {
    return col.tasks;
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
}
