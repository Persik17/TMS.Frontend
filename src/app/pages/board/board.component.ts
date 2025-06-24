import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BoardColumn, BoardTask } from '../../models/board-column.model';
import { MatDialog } from '@angular/material/dialog';
import { TaskDialogComponent } from '../task-dialog/task-dialog.component';
import { CommonModule } from '@angular/common';
import {
  DragDropModule,
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-board',
  standalone: true,
  imports: [CommonModule, DragDropModule, FormsModule],
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss'],
})
export class BoardComponent implements OnInit {
  boardId: string = '';
  columns: BoardColumn[] = [];
  connectedDropListsIds: string[] = [];

  // Для добавления задачи
  addingTaskColumnId: string | null = null;
  newTaskName = '';

  // Для добавления колонки
  addingColumn = false;
  newColumnTitle = '';
  newColumnColor = '#e3f2fd';

  // Для редактирования колонки
  editingColumnId: string | null = null;
  editColumnTitle = '';
  editColumnColor = '#e3f2fd';

  isDraggingColumnId: string | null = null;

  constructor(private route: ActivatedRoute, private dialog: MatDialog) {}

  ngOnInit() {
    this.boardId = this.route.snapshot.paramMap.get('id')!;
    const allTasks: BoardTask[] = [
      {
        id: '1',
        name: 'Сделать дизайн',
        description:
          'Подготовить макеты для главной страницы. Использовать фирменные цвета.',
        boardId: this.boardId,
        creatorId: 'user1',
        assigneeId: 'alice',
        startDate: '2025-06-20T10:00:00Z',
        endDate: '2025-06-25T18:00:00Z',
        actualClosingDate: null,
        storyPoints: 5,
        taskTypeId: 'type1',
        priority: 2,
        severity: 1,
        parentTaskId: null,
        columnId: 'todo',
        creationDate: '2025-06-19T15:00:00Z',
        updateDate: '2025-06-19T15:00:00Z',
        deleteDate: null,
        loading: false,
      },
      {
        id: '2',
        name: 'Верстка',
        description:
          'Сделать адаптивную верстку для всех экранов. Не забыть про retina и dark-mode.',
        boardId: this.boardId,
        creatorId: 'user2',
        assigneeId: 'bob',
        startDate: '2025-06-21T10:00:00Z',
        endDate: '2025-06-27T18:00:00Z',
        actualClosingDate: null,
        storyPoints: 8,
        taskTypeId: 'type2',
        priority: 1,
        severity: 2,
        parentTaskId: null,
        columnId: 'in-progress',
        creationDate: '2025-06-20T15:00:00Z',
        updateDate: '2025-06-21T09:00:00Z',
        deleteDate: null,
        loading: false,
      },
      {
        id: '3',
        name: 'Тестирование',
        description:
          'Провести тестирование всех сценариев, включая edge-cases.',
        boardId: this.boardId,
        creatorId: 'user3',
        assigneeId: 'charlie',
        startDate: '2025-06-23T10:00:00Z',
        endDate: '2025-06-29T18:00:00Z',
        actualClosingDate: null,
        storyPoints: 3,
        taskTypeId: 'type3',
        priority: 3,
        severity: 1,
        parentTaskId: null,
        columnId: 'done',
        creationDate: '2025-06-22T15:00:00Z',
        updateDate: '2025-06-23T08:00:00Z',
        deleteDate: null,
        loading: false,
      },
      {
        id: '4',
        name: 'Документация',
        description: 'Описать все API и добавить примеры запросов.',
        boardId: this.boardId,
        creatorId: 'user2',
        assigneeId: 'bob',
        startDate: '2025-06-23T10:00:00Z',
        endDate: '2025-06-30T18:00:00Z',
        actualClosingDate: null,
        storyPoints: 2,
        taskTypeId: 'type2',
        priority: 2,
        severity: 2,
        parentTaskId: null,
        columnId: 'todo',
        creationDate: '2025-06-23T10:00:00Z',
        updateDate: null,
        deleteDate: null,
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

  filteredTasks(col: BoardColumn): BoardTask[] {
    return col.tasks;
  }

  get sortedColumns() {
    return [...this.columns].sort((a, b) => a.order - b.order);
  }

  // =================== Задачи ===================
  openTaskDialog(task: BoardTask) {
    this.dialog.open(TaskDialogComponent, {
      data: {
        task: task,
        comments: this.getTaskComments(task),
        changeHistory: this.getTaskHistory(task),
        attachedFiles: this.getTaskFiles(task),
      },
      width: '80vw',
      height: '80vh',
      maxWidth: '80vw',
      panelClass: 'custom-dialog-panel',
      autoFocus: false,
    });
  }

  getPriorityLabel(priority: number) {
    switch (priority) {
      case 1:
        return 'Низкий';
      case 2:
        return 'Средний';
      case 3:
        return 'Высокий';
      default:
        return 'Без приоритета';
    }
  }

  getPriorityColor(priority: number): string {
    switch (priority) {
      case 1:
        return '#4fc3f7'; // голубой — низкий
      case 2:
        return '#ffeb3b'; // жёлтый — средний
      case 3:
        return '#e57373'; // красный — высокий
      default:
        return '#b0bec5';
    }
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
      }, 1200);
    }
  }

  // ==== Добавление задачи ====
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
      boardId: this.boardId,
      creatorId: '',
      assigneeId: '',
      startDate: new Date().toISOString(),
      endDate: null,
      actualClosingDate: null,
      storyPoints: 0,
      taskTypeId: '',
      priority: 0,
      severity: 0,
      parentTaskId: null,
      columnId: col.id,
      creationDate: new Date().toISOString(),
      updateDate: null,
      deleteDate: null,
      loading: false,
    };
    col.tasks.unshift(newTask);
    this.cancelAddTask();
  }

  // =================== Колонки ===================
  // Добавление новой колонки
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

  // Редактирование колонки
  startEditColumn(col: BoardColumn) {
    this.editingColumnId = col.id;
    this.editColumnTitle = col.title;
    this.editColumnColor = col.color;
    setTimeout(() => {
      const input = document.querySelector<HTMLInputElement>('.edit-col-input');
      input?.focus();
    });
  }
  saveEditColumn(col: BoardColumn) {
    col.title = this.editColumnTitle.trim() || col.title;
    col.color = this.editColumnColor;
    this.editingColumnId = null;
    // Тут можно добавить вызов к серверу для обновления колонки
  }
  cancelEditColumn() {
    this.editingColumnId = null;
  }

  // ==== Примеры: комментарии, история, файлы ====
  getTaskComments(task: BoardTask) {
    return [
      {
        id: 'c1',
        text: 'Отличная задача, добавьте acceptance criteria!',
        creationDate: '2025-06-22T12:30:00Z',
        updateDate: null,
        deleteDate: null,
        userId: 'alice',
        user: {
          id: 'alice',
          name: 'Alice',
          avatarUrl: 'https://i.pravatar.cc/36?u=alice',
        },
        taskId: task.id,
      },
      {
        id: 'c2',
        text: 'Взял в работу',
        creationDate: '2025-06-23T08:00:00Z',
        updateDate: null,
        deleteDate: null,
        userId: 'bob',
        user: {
          id: 'bob',
          name: 'Bob',
          avatarUrl: 'https://i.pravatar.cc/36?u=bob',
        },
        taskId: task.id,
      },
    ];
  }
  getTaskHistory(task: BoardTask) {
    return [
      {
        date: '2025-06-21T14:30:00Z',
        text: 'Изменён исполнитель',
        user: 'Bob',
      },
      {
        date: '2025-06-22T08:00:00Z',
        text: 'Обновлено описание задачи',
        user: 'Alice',
      },
    ];
  }
  getTaskFiles(task: BoardTask) {
    return [
      {
        name: 'specs.pdf',
        url: '/files/specs.pdf',
        size: '120 KB',
        date: '2025-06-20',
      },
      {
        name: 'design.png',
        url: '/files/design.png',
        size: '340 KB',
        date: '2025-06-19',
      },
    ];
  }

  onColumnDrop(event: CdkDragDrop<any[]>) {
    if (event.previousIndex === event.currentIndex) return;
    moveItemInArray(this.columns, event.previousIndex, event.currentIndex);

    // После изменения порядка, обнови поле Order для каждой колонки:
    this.columns.forEach((col, idx) => (col.order = idx));

    // Вызови метод для сохранения порядка в БД
    this.saveColumnsOrder();
  }

  // Пример метода для API:
  saveColumnsOrder() {
    // Отправь this.columns (или только id+Order) на сервер
    // this.boardService.updateColumnsOrder(this.columns).subscribe(...)
  }

  onColumnDragStarted(colId: string) {
    this.isDraggingColumnId = colId;
  }

  onColumnDragEnded() {
    this.isDraggingColumnId = null;
  }
}
