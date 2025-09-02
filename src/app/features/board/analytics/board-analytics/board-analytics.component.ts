import { Component, Input } from '@angular/core';
import { BoardChartConfig } from '../../../../core/models/chart.model';
import { ChartData, ChartConfiguration } from 'chart.js';
import { CommonModule } from '@angular/common';
import { BaseChartDirective } from 'ng2-charts';

@Component({
  selector: 'app-board-analytics',
  standalone: true,
  imports: [CommonModule, BaseChartDirective],
  templateUrl: './board-analytics.component.html',
  styleUrls: ['./board-analytics.component.scss'],
})
export class BoardAnalyticsComponent {
  @Input() columns: { title: string; color: string; tasks: { id: string }[] }[] = [];

  chartOptions: ChartConfiguration['options'] = {
    responsive: true,
    plugins: { legend: { display: true } },
    scales: { x: {}, y: { beginAtZero: true } },
  };

  velocityData: ChartData<'bar'> = {
    labels: ['Спринт 1', 'Спринт 2', 'Спринт 3', 'Спринт 4'],
    datasets: [
      {
        label: 'Завершено SP',
        data: [12, 17, 14, 20],
        backgroundColor: '#1976d2',
      },
    ],
  };

  burndownData: ChartData<'line'> = {
    labels: ['01.06', '02.06', '03.06', '04.06', '05.06', '06.06', '07.06'],
    datasets: [
      {
        label: 'Оставшиеся задачи',
        data: [15, 12, 10, 7, 4, 1, 0],
        borderColor: '#1976d2',
        backgroundColor: 'rgba(25, 118, 210, 0.05)',
        fill: false,
        tension: 0.3,
      },
      {
        label: 'Идеальный спуск',
        data: [15, 13, 11, 9, 6, 3, 0],
        borderDash: [5, 5],
        borderColor: '#aaa',
        fill: false,
        tension: 0.3,
      },
    ],
  };

  get cfdData(): ChartData<'bar'> {
    const days = [
      '01.06',
      '02.06',
      '03.06',
      '04.06',
      '05.06',
      '06.06',
      '07.06',
    ];
    return {
      labels: days,
      datasets: this.columns.map((col) => ({
        label: col.title,
        data: days.map((_, i) =>
          Math.round(col.tasks.length * (i / (days.length - 1)))
        ),
        backgroundColor: col.color,
        stack: 'stack-0',
      })),
    };
  }
}
