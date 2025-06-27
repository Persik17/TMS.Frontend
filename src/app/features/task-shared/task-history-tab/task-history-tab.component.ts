import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-task-history-tab',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './task-history-tab.component.html',
  styleUrls: ['./task-history-tab.component.scss'],
})
export class TaskHistoryTabComponent {
  @Input() changeHistory: any[] = [];
}
