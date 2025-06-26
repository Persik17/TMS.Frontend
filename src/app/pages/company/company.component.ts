import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-company',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './company.component.html',
  styleUrls: ['./company.component.scss'],
})
export class CompanyComponent {
  tab: 'info' | 'ceo' | 'tariff' = 'info';

  company: CompanyViewModel = {
    name: 'ООО Тестовая компания',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4a/Logo_2013_Google.png/320px-Logo_2013_Google.png',
    inn: '1234567890',
    ogrn: '1027700132195',
    address: 'г. Москва, ул. Примерная, д. 1',
    website: 'https://test-company.ru',
    industry: 'IT/Технологии',
    description:
      'Ведущий разработчик решений для управления командами и проектами.',
    contactEmail: 'info@test-company.ru',
    contactPhone: '+7 495 123-45-67',
    isActive: true,
    ceoSummary: {
      boards: [
        {
          name: 'Проект Alpha',
          tasksTotal: 42,
          tasksDone: 30,
          tasksInProgress: 12,
        },
        {
          name: 'Маркетинг 2025',
          tasksTotal: 18,
          tasksDone: 15,
          tasksInProgress: 3,
        },
        { name: 'HR и найм', tasksTotal: 9, tasksDone: 7, tasksInProgress: 2 },
      ],
      totalTasks: 69,
      totalDone: 52,
      totalInProgress: 17,
      leadBoard: 'Проект Alpha',
      mostActiveUser: 'alice',
    },
    tariffSummary: {
      planName: 'Бизнес',
      isTrial: false,
      status: 'active',
      period: '01.06.2025 – 01.07.2025',
      usersLimit: 50,
      boardsLimit: 20,
      tasksLimit: 5000,
      currentUsers: 23,
      currentBoards: 6,
      currentTasks: 412,
      autoRenew: true,
      renewalDate: '01.07.2025',
      pricePerPeriod: 2990,
      currency: '₽',
      features: [
        'Все основные функции',
        'Расширенные отчёты',
        'Приоритетная поддержка',
        'Безлимит на задачи в рамках тарифа',
      ],
    },
  };

  setTab(tab: 'info' | 'ceo' | 'tariff') {
    this.tab = tab;
  }
}
