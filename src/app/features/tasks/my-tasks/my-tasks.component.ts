import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import {
  MyTask,
  MyTaskPriority,
  MyTaskStatus,
} from '../../../core/models/my-task.model';
import { TaskService } from '../../../core/services/task.service';

type RawTask = {
  id: string;
  name: string;
  description?: string;
  boardId: string;
  boardName: string;
  status?: any;
  priority: number | null;
  storyPoints: number | null;
  startDate?: string | null;
  endDate?: string | null;
  assigneeId?: string;
  assigneeName?: string;
  taskTypeId?: string;
  columnId?: string;
  creationDate?: string | null;
  updateDate?: string | null;
  deleteDate?: string | null;
};

@Component({
  selector: 'app-my-tasks',
  imports: [CommonModule, FormsModule, MatIconModule],
  templateUrl: './my-tasks.component.html',
  styleUrls: ['./my-tasks.component.scss'],
})
export class MyTasksComponent implements OnInit {
  tasks: MyTask[] = [];

  filter = {
    query: '',
    status: '',
    priority: '',
  };

  openBoards: { [boardId: string]: boolean } = {};

  constructor(private router: Router, private taskService: TaskService) {}

  ngOnInit() {
    const userId = localStorage.getItem('userId');
    if (!userId) {
      alert('Вы не авторизованы!');
      return;
    }
    this.taskService.getMyTasks(userId).subscribe({
      next: (tasks: RawTask[]) => {
        this.tasks = tasks.map(this.mapRawTaskToMyTask);
        this.openBoards = {};
        for (const t of this.tasks) {
          this.openBoards[t.boardId] = true;
        }
      },
      error: () => {
        this.tasks = [];
      },
    });
  }

  mapRawTaskToMyTask(raw: RawTask): MyTask {
    const priorityMap: Record<number, MyTaskPriority> = {
      1: 'high',
      2: 'medium',
      3: 'low',
    };
    const status: MyTaskStatus = 'open';

    return {
      id: raw.id,
      title: raw.name,
      description: raw.description ?? '',
      boardId: raw.boardId,
      boardName: raw.boardName,
      status,
      priority: raw.priority ? priorityMap[raw.priority] ?? 'low' : 'low',
      sp: raw.storyPoints ?? '',
      dates: {
        start: raw.startDate ? new Date(raw.startDate) : null,
        end: raw.endDate ? new Date(raw.endDate) : null,
      },
      assigneeId: raw.assigneeId,
      assigneeName: raw.assigneeName,
      taskTypeId: raw.taskTypeId,
      columnId: raw.columnId,
      creationDate: raw.creationDate ? new Date(raw.creationDate) : null,
      updateDate: raw.updateDate ? new Date(raw.updateDate) : null,
      deleteDate: raw.deleteDate ? new Date(raw.deleteDate) : null,
    };
  }

  groupedTasks() {
    let filtered = this.tasks.filter((t) => {
      let textMatch =
        this.filter.query.trim() === '' ||
        t.title.toLowerCase().includes(this.filter.query.toLowerCase()) ||
        t.boardName.toLowerCase().includes(this.filter.query.toLowerCase());
      let statusMatch = !this.filter.status || t.status === this.filter.status;
      let priorityMatch =
        !this.filter.priority || t.priority === this.filter.priority;
      return textMatch && statusMatch && priorityMatch;
    });

    const groups: { boardId: string; boardName: string; tasks: MyTask[] }[] =
      [];
    for (const task of filtered) {
      let group = groups.find((g) => g.boardId === task.boardId);
      if (!group) {
        group = { boardId: task.boardId, boardName: task.boardName, tasks: [] };
        groups.push(group);
      }
      group.tasks.push(task);
    }
    return groups;
  }

  isBoardOpen(boardId: string): boolean {
    return !!this.openBoards[boardId];
  }

  toggleBoard(boardId: string) {
    this.openBoards[boardId] = !this.openBoards[boardId];
  }

  goToTask(task: MyTask) {
    this.router.navigate(['/tasks', task.id]);
  }

  priorityLabel(p: MyTaskPriority) {
    if (p === 'high') return 'Высокий';
    if (p === 'medium') return 'Средний';
    return 'Низкий';
  }

  statusLabel(s: MyTaskStatus) {
    if (s === 'done') return 'Выполнено';
    return 'В работе';
  }
}
