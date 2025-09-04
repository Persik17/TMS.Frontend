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

  openBoards: Set<string> = new Set();

  constructor(private router: Router, private taskService: TaskService) {}

  ngOnInit() {
    const userId = localStorage.getItem('userId');
    if (!userId) {
      alert('Вы не авторизованы!');
      return;
    }
    this.taskService.getMyTasks(userId).subscribe({
      next: (tasks) => {
        this.tasks = tasks;
        this.openBoards = new Set(this.tasks.map((t) => t.boardId));
      },
      error: () => {
        this.tasks = [];
      },
    });
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
    return this.openBoards.has(boardId);
  }

  toggleBoard(boardId: string) {
    if (this.openBoards.has(boardId)) {
      this.openBoards.delete(boardId);
    } else {
      this.openBoards.add(boardId);
    }
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
