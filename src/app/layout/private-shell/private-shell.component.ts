import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from '../header/header.component';
import { FooterComponent } from '../footer/footer.component';
import { SidebarComponent } from '../sidebar/sidebar.component';

@Component({
  selector: 'app-private-shell',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, FooterComponent, SidebarComponent],
  template: `
    <app-header></app-header>
    <div class="layout">
      <app-sidebar></app-sidebar>
      <main class="private-main"><router-outlet></router-outlet></main>
    </div>
    <app-footer></app-footer>
  `,
  styles: [`
    .layout {
      display: flex;
      min-height: calc(100vh - 56px - 44px);
      padding-top: 56px;
      padding-bottom: 44px;
    }
    .private-main {
      flex: 1;
      padding: 2.5rem 2.5rem 1.5rem 240px;
      background: #fff;
      min-height: calc(100vh - 56px - 44px);
    }
  `]
})
export class PrivateShellComponent {}
