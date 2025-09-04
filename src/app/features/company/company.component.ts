import { CompanyViewModel } from './../../core/models/company.model';
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CompanyService } from './../../core/services/company.service';

@Component({
  selector: 'app-company',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './company.component.html',
  styleUrls: ['./company.component.scss'],
})
export class CompanyComponent implements OnInit {
  company: CompanyViewModel | null = null;
  tab: 'info' | 'ceo' | 'tariff' = 'info';
  error = '';

  constructor(private companyService: CompanyService) {}

  ngOnInit(): void {
    this.loadCompany();
  }

  loadCompany(): void {
    const userId = localStorage.getItem('userId') || '';
    const companyId = localStorage.getItem('companyId') || '';

    if (!userId) {
      this.error = 'Пользователь не найден';
      return;
    }

    if (!companyId) {
      this.error = 'Компания не найдена';
      return;
    }

    this.companyService.getCompany(userId, companyId).subscribe({
      next: (company) => {
        this.company = company;
      },
      error: (err) => {
        console.error('Ошибка загрузки компании:', err);
      },
    });
  }

  setTab(tab: 'info' | 'ceo' | 'tariff') {
    this.tab = tab;
  }
}
