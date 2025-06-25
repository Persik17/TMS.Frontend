import { Component, HostListener, inject } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NgIf } from '@angular/common';
import { RouterLink } from '@angular/router';
import { GlobalSearchComponent } from '../../pages/global-search/global-search.component'; // замените путь при необходимости

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, NgIf, GlobalSearchComponent],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent {
  menuOpen = false;
  user = {
    username: 'Persik172',
    avatarUrl: 'https://randomuser.me/api/portraits/men/32.jpg',
  };

  companyName = 'TMS';

  boardName?: string;
  taskName?: string;

  private router = inject(Router);
  private route = inject(ActivatedRoute);

  constructor() {
    // Здесь нужно подгружать реальные названия доски и задачи!
    // Замените на реальные сервисы/селекторы/асинхронные данные по вашему проекту.
    // Пример с мок-данными для скриншота:
    this.router.events.subscribe(() => {
      const url = this.router.url;
      if (/^\/boards\/\d+$/.test(url)) {
        this.boardName = 'Проект Alpha'; // <-- реальное название доски
        this.taskName = undefined;
      } else if (/^\/boards\/\d+\/tasks\/\d+$/.test(url)) {
        this.boardName = 'Проект Alpha';
        this.taskName = 'Сделать дизайн'; // <-- реальное название задачи
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
    alert('Вы вышли из аккаунта');
  }

  onGlobalSelect(event: any) {
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
