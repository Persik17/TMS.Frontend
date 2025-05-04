import { Component, Input } from '@angular/core';
import { Department } from './../../../core/models/department.model';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-department-card',
  standalone: true,
  imports: [CommonModule, MatCardModule],
  templateUrl: './department-card.component.html',
  styleUrls: ['./department-card.component.css']
})
export class DepartmentCardComponent {
  @Input() department: Department | undefined;
}
