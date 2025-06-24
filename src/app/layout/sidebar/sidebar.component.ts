import { Component } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { NgIf } from '@angular/common';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, NgIf],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent {
  boardId?: string;
  isBoardPage = false;

  constructor(private router: Router) {
    this.checkBoardPage(this.router.url);

    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event) => {
        this.checkBoardPage((event as NavigationEnd).urlAfterRedirects);
      });
  }

  private checkBoardPage(url: string) {
    // Вытаскиваем boardId из урла /boards/:id или /boards/:id/*
    const match = url.match(/^\/boards\/([^/]+)/);
    this.isBoardPage = !!match;
    this.boardId = match ? match[1] : undefined;
  }
}
