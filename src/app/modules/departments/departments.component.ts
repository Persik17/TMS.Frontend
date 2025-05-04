import { Component } from '@angular/core';
import { Department } from '../../core/models/department.model';
import { CommonModule } from '@angular/common';
import { DepartmentCardComponent } from './department-card/department-card.component';

@Component({
  selector: 'app-departments',
  standalone: true,
  imports: [CommonModule, DepartmentCardComponent],
  templateUrl: './departments.component.html',
  styleUrls: ['./departments.component.css']
})
export class DepartmentsComponent {
  departments: Department[] = [
    { id: "1", name: 'Marketing', companyId: "1" },
    { id: "2", name: 'Sales', companyId: "1"  },
    { id: "3", name: 'Engineering', companyId: "1"  }
  ];
}
