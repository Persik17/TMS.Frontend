import { Component } from '@angular/core';
import { Board } from '../../core/models/board.model';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { BoardsListComponent } from './boards-list/boards-list.component';

@Component({
  selector: 'app-boards',
  standalone: true,
  imports: [CommonModule, MatTableModule, BoardsListComponent],
  templateUrl: './boards.component.html',
  styleUrls: ['./boards.component.css']
})
export class BoardsComponent {
  boards: Board[] = [
    { id: "1", name: 'Marketing Strategy', departmentId: "1" },
    { id: "2", name: 'Sales Pipeline', departmentId: "2" },
    { id: "3", name: 'Product Roadmap', departmentId: "3" }
  ];
}
