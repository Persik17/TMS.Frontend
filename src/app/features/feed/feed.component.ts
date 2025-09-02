import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FeedItem } from '../../core/models/feed.model';

@Component({
  selector: 'app-feed',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './feed.component.html',
  styleUrls: ['./feed.component.scss'],
})
export class FeedComponent implements OnInit {
  feed: FeedItem[] = [
    {
      id: 1,
      title: 'Запущен новый проект!',
      content: 'Мы рады сообщить о запуске нового проекта для команды.',
      date: '2025-06-23',
    },
    {
      id: 2,
      title: 'Обновление системы',
      content:
        'Прошло важное обновление системы, рекомендуем ознакомиться с изменениями.',
      date: '2025-06-22',
    },
    {
      id: 3,
      title: 'Поздравляем с праздником!',
      content: 'Всем сотрудникам приятного отдыха!',
      date: '2025-06-12',
    },
    {
      id: 4,
      title: 'Добавлены новые функции',
      content:
        'Теперь вы можете использовать фильтры задач по дате и исполнителю.',
      date: '2025-06-10',
    },
    {
      id: 5,
      title: 'Ремонт серверной',
      content:
        'В ночь с 15 на 16 июня сервис будет недоступен с 02:00 до 05:00.',
      date: '2025-06-09',
    },
    {
      id: 6,
      title: 'Тренинг по Agile',
      content: 'Запишитесь на тренинг через раздел "Обучение".',
      date: '2025-06-07',
    },
    {
      id: 7,
      title: 'Внедрение новых стандартов',
      content: 'С 1 июля вводятся новые стандарты оформления задач.',
      date: '2025-06-05',
    },
    {
      id: 8,
      title: 'Переезд офиса',
      content: 'В этом месяце произойдет переезд офиса на новый адрес.',
      date: '2025-06-02',
    },
    {
      id: 9,
      title: 'Технические работы',
      content: 'Плановые технические работы 28 июня с 00:00 до 04:00.',
      date: '2025-05-31',
    },
    {
      id: 10,
      title: 'Благодарность команде',
      content: 'Выражаем благодарность всем участникам внедрения CRM!',
      date: '2025-05-28',
    },
    {
      id: 11,
      title: 'Мероприятие выходного дня',
      content: 'Приглашаем на выездное мероприятие 15 июня.',
      date: '2025-05-24',
    },
    {
      id: 12,
      title: 'Расширение команды',
      content: 'Открыты вакансии для отдела разработки.',
      date: '2025-05-20',
    },
    {
      id: 13,
      title: 'Обновление интерфейса',
      content: 'Обновлен дизайн панели управления.',
      date: '2025-05-16',
    },
    {
      id: 14,
      title: 'Ежемесячный отчёт',
      content: 'Доступен новый отчёт по эффективности проектов.',
      date: '2025-05-12',
    },
    {
      id: 15,
      title: 'День здоровья',
      content:
        '12 июня – корпоративный День здоровья. Не забудьте принять участие!',
      date: '2025-05-10',
    },
  ];

  readIds: number[] = [];
  modalOpen = false;
  selectedItem: FeedItem | null = null;

  ngOnInit() {
    const stored = localStorage.getItem('readFeedIds');
    this.readIds = stored ? JSON.parse(stored) : [];
  }

  markAsRead(id: number) {
    if (!this.readIds.includes(id)) {
      this.readIds.push(id);
      localStorage.setItem('readFeedIds', JSON.stringify(this.readIds));
    }
  }

  markAllAsRead() {
    this.readIds = this.feed.map((item) => item.id);
    localStorage.setItem('readFeedIds', JSON.stringify(this.readIds));
  }

  isRead(id: number): boolean {
    return this.readIds.includes(id);
  }

  openModal(item: FeedItem) {
    this.selectedItem = item;
    this.modalOpen = true;
    this.markAsRead(item.id);
  }

  closeModal() {
    this.modalOpen = false;
    this.selectedItem = null;
  }
}
