import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { NgIf, NgFor } from '@angular/common';
import { filter } from 'rxjs/operators';
import { MatIconModule } from '@angular/material/icon';
import { BoardService } from '../../core/services/board.service';
import { Board } from '../../core/models/board.model';

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

  boards: Board[] = [];
  maxBoardsInSidebar = 5;
  loading = true;
  error = '';

  constructor(private router: Router, private boardService: BoardService) {
    this.checkBoardPage(this.router.url);

    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event) => {
        this.checkBoardPage((event as NavigationEnd).urlAfterRedirects);
      });
  }

  ngOnInit(): void {
    const companyId = localStorage.getItem('companyId') || '';
    if (!companyId) {
      this.error = 'Компания не найдена';
      this.loading = false;
      return;
    }
    this.boardService.getBoards(companyId).subscribe({
      next: (boards) => {
        this.boards = boards;
        this.loading = false;
      },
      error: () => {
        this.error = 'Ошибка загрузки досок';
        this.loading = false;
      },
    });
  }

  private checkBoardPage(url: string) {
    const match = url.match(/^\/boards\/([^/]+)/);
    this.isBoardPage = !!match;
    this.boardId = match ? match[1] : undefined;
  }

  get shownBoards(): Board[] {
    return this.boards.slice(0, this.maxBoardsInSidebar);
  }
  get hasMoreBoards(): boolean {
    return this.boards.length > this.maxBoardsInSidebar;
  }

  get hasUnreadFeed(): boolean {
    const feed = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];
    const readIds = JSON.parse(localStorage.getItem('readFeedIds') || '[]');
    return feed.some((id) => !readIds.includes(id));
  }
}
