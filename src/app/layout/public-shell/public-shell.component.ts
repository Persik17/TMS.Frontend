import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from '../header/header.component';
import { FooterComponent } from '../footer/footer.component';

@Component({
  selector: 'app-public-shell',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, FooterComponent],
  template: `
    <app-header></app-header>
    <main class="public-main"><router-outlet></router-outlet></main>
    <app-footer></app-footer>
  `,
  styles: [`
    .public-main {
      min-height: calc(100vh - 56px - 44px);
      padding-top: 56px;
      padding-bottom: 44px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: #f5f5f5;
    }
  `]
})
export class PublicShellComponent {}
