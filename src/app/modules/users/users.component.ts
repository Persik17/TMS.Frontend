import { Component } from '@angular/core';
import { User } from '../../core/models/user.model';
import { CommonModule } from '@angular/common';
import { UsersListComponent } from './users-list/users-list.component';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule, UsersListComponent],
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent {
  users: User[] = [
    { id: "1", firstName: 'John', lastName: 'Doe', email: 'john.doe@example.com' },
    { id: "2", firstName: 'Jane',lastName: 'Smith', email: 'jane.smith@example.com' }
  ];
}
