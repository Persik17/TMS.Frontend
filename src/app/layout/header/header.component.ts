import {
  Component,
  HostListener,
  inject,
  OnInit,
  ChangeDetectorRef,
} from '@angular/core';
import { Router, NavigationStart, ActivatedRoute } from '@angular/router';
import { NgIf, NgStyle } from '@angular/common';
import { RouterLink } from '@angular/router';
import { GlobalSearchComponent } from '../../shared/components/global-search/global-search.component';
import { CompanyService } from '../../core/services/company.service';

function getInitials(name: string): string {
  if (!name) return '';
  const parts = name.trim().split(' ');
  if (parts.length === 1) {
    return parts[0].substring(0, 2).toUpperCase();
  }
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

function getRandomColor(): string {
  const colors = [
    '#2196f3',
    '#4caf50',
    '#ff9800',
    '#9c27b0',
    '#f44336',
    '#00bcd4',
    '#ffb300',
    '#8bc34a',
    '#e91e63',
    '#795548',
  ];
  return colors[Math.floor(Math.random() * colors.length)];
}

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, NgIf, NgStyle, GlobalSearchComponent],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  menuOpen = false;
  user: { username: string; avatarUrl?: string } = { username: '' };

  companyName = 'TMS';

  boardName?: string;
  taskName?: string;

  userInitials: string = '';
  initialsColor: string = getRandomColor();

  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private companyService = inject(CompanyService);
  private cdr = inject(ChangeDetectorRef);

  ngOnInit(): void {
    const userId = localStorage.getItem('userId');
    const companyId = localStorage.getItem('companyId') || '';
    if (userId) {
      this.companyService.getCompany(userId, companyId).subscribe({
        next: (company) => {
          if (company && company.name) {
            this.companyName = company.name;
          } else {
            this.companyName = 'TMS';
          }
        },
        error: () => {
          this.companyName = 'TMS';
        },
      });
    } else {
      this.companyName = 'TMS';
    }

    const username = localStorage.getItem('username');
    if (username && username.trim().length > 0) {
      this.user.username = username;
      this.userInitials = getInitials(username);
      this.initialsColor = getRandomColor();
    } else {
      this.user.username = '';
      this.userInitials = '';
    }

    this.router.events.subscribe((event) => {
      if (event instanceof NavigationStart) {
        this.menuOpen = false;
        this.cdr.detectChanges();
      }
      const url = this.router.url;
      const isBoard = /^\/boards\//.test(url);
      const isTask = /^\/boards\//.test(url) && /\/tasks\//.test(url);
      this.boardName = undefined;
      this.taskName = undefined;
    });
  }

  toggleMenu(event: MouseEvent) {
    event.stopPropagation();
    this.menuOpen = !this.menuOpen;
  }

  goToProfile() {
    this.menuOpen = false;
    this.cdr.detectChanges();
    this.router.navigate(['/profile']);
  }

  logout() {
    this.menuOpen = false;
    this.cdr.detectChanges();
    localStorage.removeItem('token');
    this.router.navigate(['/auth/login']);
  }

  onGlobalSelect(event: { type: 'user' | 'board' | 'task'; id: string }) {
    if (event.type === 'user') {
      this.router.navigate(['/users', event.id]);
    } else if (event.type === 'board') {
      this.router.navigate(['/boards', event.id]);
    } else if (event.type === 'task') {
      this.router.navigate(['/tasks', event.id]);
    }
  }
}
