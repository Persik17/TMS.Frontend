import { Component, Input } from '@angular/core';
import { User } from './../../../core/models/user.model';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';

@Component({
  selector: 'app-users-list',
  standalone: true,
  imports: [CommonModule, MatTableModule],
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.css']
})
export class UsersListComponent {
  @Input() users: User[] = [];
  displayedColumns: string[] = ['name', 'email'];
}
