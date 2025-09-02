import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-public-shell',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './public-shell.component.html',
  styleUrls: ['./public-shell.component.scss'],
})
export class PublicShellComponent {}
