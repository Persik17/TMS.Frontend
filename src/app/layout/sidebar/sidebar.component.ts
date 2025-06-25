import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { NgIf, NgFor } from '@angular/common';
import { filter } from 'rxjs/operators';
import { MatIconModule } from '@angular/material/icon';

// BoardStub interface
interface BoardStub {
  id: string;
  name: string;
  owner?: string;
  privacy?: string;
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, NgIf, NgFor, MatIconModule],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent implements OnInit {
  boardId?: string;
  isBoardPage = false;

  // Моковые данные для проверки подсписка
  boards: BoardStub[] = [
    { id: '1', name: 'Проект Alpha', owner: 'Иван Петров', privacy: 'private' },
    {
      id: '2',
      name: 'Общая доска',
      owner: 'Елена Сидорова',
      privacy: 'public',
    },
    {
      id: '3',
      name: 'Маркетинг 2025',
      owner: 'Иван Петров',
      privacy: 'private',
    },
    { id: '4', name: 'HR и найм', owner: 'Мария Ким', privacy: 'public' },
    { id: '5', name: 'Финансы', owner: 'Петр Ким', privacy: 'private' },
    {
      id: '6',
      name: 'Моя секретная',
      owner: 'Иван Петров',
      privacy: 'private',
    },
    { id: '7', name: 'Дизайн', owner: 'Екатерина Серова', privacy: 'public' },
    {
      id: '8',
      name: 'Разработка',
      owner: 'Даниил Романов',
      privacy: 'private',
    },
  ];

  maxBoardsInSidebar = 5;

  constructor(private router: Router) {
    this.checkBoardPage(this.router.url);

    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event) => {
        this.checkBoardPage((event as NavigationEnd).urlAfterRedirects);
      });
  }

  ngOnInit(): void {}

  private checkBoardPage(url: string) {
    // Вытаскиваем boardId из урла /boards/:id или /boards/:id/*
    const match = url.match(/^\/boards\/([^/]+)/);
    this.isBoardPage = !!match;
    this.boardId = match ? match[1] : undefined;
  }

  get shownBoards(): BoardStub[] {
    return this.boards.slice(0, this.maxBoardsInSidebar);
  }
  get hasMoreBoards(): boolean {
    return this.boards.length > this.maxBoardsInSidebar;
  }

  get hasUnreadFeed(): boolean {
    const feed = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]; // список id новостей
    const readIds = JSON.parse(localStorage.getItem('readFeedIds') || '[]');
    return feed.some((id) => !readIds.includes(id));
  }
}
