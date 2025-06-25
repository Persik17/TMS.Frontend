import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';

interface Task {
  id: string;
  title: string;
  priority: 'low' | 'medium' | 'high';
  status: 'open' | 'done';
  sp: number;
  boardId: string;
  boardName: string;
  dates?: { start: Date; end: Date };
}

@Component({
  selector: 'app-my-tasks',
  imports: [CommonModule, FormsModule, MatIconModule],
  templateUrl: './my-tasks.component.html',
  styleUrls: ['./my-tasks.component.scss'],
})
export class MyTasksComponent implements OnInit {
  tasks: Task[] = [
    {
      id: 't1',
      title: 'Сделать дизайн',
      priority: 'medium',
      status: 'open',
      sp: 5,
      boardId: 'b1',
      boardName: 'Проект Alpha',
      dates: { start: new Date(2025, 5, 20), end: new Date(2025, 5, 25) },
    },
    {
      id: 't2',
      title: 'Верстка',
      priority: 'low',
      status: 'open',
      sp: 8,
      boardId: 'b1',
      boardName: 'Проект Alpha',
      dates: { start: new Date(2025, 5, 21), end: new Date(2025, 5, 27) },
    },
    {
      id: 't3',
      title: 'Тестирование',
      priority: 'high',
      status: 'done',
      sp: 3,
      boardId: 'b1',
      boardName: 'Проект Alpha',
      dates: { start: new Date(2025, 5, 23), end: new Date(2025, 5, 29) },
    },
    {
      id: 't4',
      title: 'Заполнить документы',
      priority: 'medium',
      status: 'open',
      sp: 2,
      boardId: 'b2',
      boardName: 'Маркетинг 2025',
      dates: { start: new Date(2025, 5, 24), end: new Date(2025, 5, 28) },
    },
  ];

  filter = {
    query: '',
    status: '',
    priority: '',
  };

  openBoards: Set<string> = new Set();

  constructor(private router: Router) {}

  ngOnInit() {
    // Открываем все группы по умолчанию
    this.openBoards = new Set(this.tasks.map((t) => t.boardId));
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

    const groups: { boardId: string; boardName: string; tasks: Task[] }[] = [];
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

  goToTask(task: Task) {
    // Переход на отдельную страницу задачи
    this.router.navigate(['/tasks', task.id]);
  }

  priorityLabel(p: string) {
    if (p === 'high') return 'Высокий';
    if (p === 'medium') return 'Средний';
    return 'Низкий';
  }

  statusLabel(s: string) {
    if (s === 'done') return 'Выполнено';
    return 'В работе';
  }
}
