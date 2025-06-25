import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-plan',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './plan.component.html',
  styleUrls: ['./plan.component.scss'],
})
export class PlanComponent {
  user: any;
  usedBoards: number = 0;
  usedMaxUsersPerBoard: number = 0;
  telegramConnected: boolean = false;

  constructor() {
    this.user = JSON.parse(localStorage.getItem('user') || '{}');
    this.usedBoards = Number(localStorage.getItem('usedBoards')) || 0;
    this.usedMaxUsersPerBoard =
      Number(localStorage.getItem('usedMaxUsersPerBoard')) || 0;
    this.telegramConnected =
      localStorage.getItem('telegramConnected') === 'true';
  }
}
