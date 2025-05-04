import { Component, Input } from '@angular/core';
import { Department } from './../../../core/models/department.model';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';

@Component({
  selector: 'app-departments-list',
  standalone: true,
  imports: [CommonModule, MatTableModule],
  templateUrl: './departments-list.component.html',
  styleUrls: ['./departments-list.component.css']
})
export class DepartmentsListComponent {
  @Input() departments: Department[] = [];
  displayedColumns: string[] = ['name', 'description'];
}
