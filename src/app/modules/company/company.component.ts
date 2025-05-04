import { Component } from '@angular/core';
import { Company } from '../../core/models/company.model';

@Component({
  selector: 'app-company',
  standalone: true,
  templateUrl: './company.component.html',
  styleUrls: ['./company.component.css']
})
export class CompanyComponent {
  company: Company = {
    id: "1",
    name: 'Acme Corp'
  };
}
