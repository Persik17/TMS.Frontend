import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Tariff {
  name: string;
  price: string;
  description: string;
  features: string[];
  highlight?: boolean;
  payUrl?: string;
}

@Component({
  selector: 'app-license',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './license.component.html',
  styleUrls: ['./license.component.scss'],
})
export class LicenseComponent {
  tariffs: Tariff[] = [
    {
      name: 'Free',
      price: '0 ₽',
      description: 'Для небольших команд и личного использования',
      features: [
        'До 3 досок',
        'До 5 человек на доску',
        'Нет интеграции с Telegram',
        'Базовые уведомления на email',
      ],
      // payUrl не нужен
    },
    {
      name: 'Basic',
      price: '290 ₽/мес',
      description: 'Для растущих команд и малых бизнесов',
      features: [
        'До 10 досок',
        'До 20 человек на доску',
        'Уведомления на email и Telegram',
        'Приоритетная поддержка',
      ],
      highlight: true,
      payUrl: 'https://tbank.ru/pay?plan=basic',
    },
    {
      name: 'Pro',
      price: '690 ₽/мес',
      description: 'Для профессиональных команд и организаций',
      features: [
        'Неограниченное кол-во досок',
        'До 50 человек на доску',
        'Уведомления на email и Telegram',
        'Расширенная аналитика',
        'Выделенная поддержка',
      ],
      payUrl: 'https://tbank.ru/pay?plan=pro',
    },
  ];

  onChooseTariff(tariff: Tariff) {
    if (tariff.payUrl) {
      window.open(tariff.payUrl, '_blank');
    }
  }
}
