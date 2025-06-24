import { Component, HostListener } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, NgIf],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent {
  menuOpen = false;
  user = {
    username: 'whodieddude',
    avatarUrl: 'https://randomuser.me/api/portraits/men/32.jpg', // пример, замени на свой url
  };

  toggleMenu(event: MouseEvent) {
    event.stopPropagation();
    this.menuOpen = !this.menuOpen;
  }

  @HostListener('document:click')
  closeMenu() {
    this.menuOpen = false;
  }

  logout() {
    // Здесь нужно реализовать реальный выход из аккаунта
    alert('Вы вышли из аккаунта');
  }
}
