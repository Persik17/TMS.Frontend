import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard-settings-info-tab',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './info-tab.component.html',
  styleUrls: ['./info-tab.component.scss'],
})
export class DashboardSettingsInfoTabComponent {
  @Input() board!: {
    name: string;
    description: string;
    department: string;
    boardType: number | string;
    isPrivate: boolean;
  };
}
