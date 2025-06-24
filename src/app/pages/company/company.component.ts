import { Component, OnInit } from '@angular/core';
import { CompanyService, CompanyViewModel } from '../../services/company.service';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-company',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './company.component.html',
  styleUrls: ['./company.component.scss']
})
export class CompanyComponent implements OnInit {
  company: CompanyViewModel | null = null;

  constructor(
    private companyService: CompanyService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    const companyId = this.route.snapshot.queryParamMap.get('id') ?? 'COMPANY_GUID';
    this.companyService.getCompany(companyId).subscribe({
      next: company => this.company = company,
      error: () => this.company = null
    });
  }
}
