import { Component, HostListener, inject } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NgIf } from '@angular/common';
import { RouterLink } from '@angular/router';
import { GlobalSearchComponent } from '../../shared/components/global-search/global-search.component'; // замените путь при необходимости

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, NgIf, GlobalSearchComponent],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent {
  menuOpen = false;
  user: { username: string; avatarUrl?: string } = { username: '' };

  companyName = 'TMS';

  boardName?: string;
  taskName?: string;

  private router = inject(Router);
  private route = inject(ActivatedRoute);

  constructor() {
    this.router.events.subscribe(() => {
      const url = this.router.url;
      const isBoard = /^\/boards\//.test(url);
      const isTask = /^\/boards\//.test(url) && /\/tasks\//.test(url);
      if (isTask) {
        this.boardName = undefined;
        this.taskName = undefined;
      } else if (isBoard) {
        this.boardName = undefined;
        this.taskName = undefined;
      } else {
        this.boardName = undefined;
        this.taskName = undefined;
      }
    });
  }

  toggleMenu(event: MouseEvent) {
    event.stopPropagation();
    this.menuOpen = !this.menuOpen;
  }

  @HostListener('document:click')
  closeMenu() {
    this.menuOpen = false;
  }

  logout() {
    localStorage.removeItem('token');
    this.router.navigate(['/auth/login']);
  }

  onGlobalSelect(event: { type: 'user' | 'board' | 'task'; id: string }) {
    // Навигация по результату поиска
    if (event.type === 'user') {
      this.router.navigate(['/users', event.id]);
    } else if (event.type === 'board') {
      this.router.navigate(['/boards', event.id]);
    } else if (event.type === 'task') {
      this.router.navigate(['/tasks', event.id]);
    }
  }
}
