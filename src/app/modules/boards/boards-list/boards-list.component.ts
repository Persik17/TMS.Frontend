import { Board } from './../../../core/models/board.model';
import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-boards-list',
  standalone: true,
  imports: [CommonModule, MatCardModule],
  templateUrl: './boards-list.component.html',
  styleUrls: ['./boards-list.component.css']
})
export class BoardsListComponent {
  @Input() boards: Board[] = [];
}
