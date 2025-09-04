import { Component, Input, OnInit } from '@angular/core';
import {
  BoardChartConfig,
  ChartType,
} from '../../../../core/models/chart.model';
import { ChartConfiguration, ChartData } from 'chart.js';
import { CommonModule } from '@angular/common';
import { BaseChartDirective } from 'ng2-charts';
import { BoardService } from '../../../../core/services/board.service';

type VelocityPoint = { sprintName: string; completedStoryPoints: number };
type BurnDownPoint = {
  date: string;
  remainingTasks: number;
  idealTasks: number;
};
type CfdPoint = { date: string; columnTaskCounts: Record<string, number> };

interface BoardAnalyticsDto {
  velocity: VelocityPoint[];
  burndown: BurnDownPoint[];
  cfd: CfdPoint[];
}

@Component({
  selector: 'app-board-analytics',
  standalone: true,
  imports: [CommonModule, BaseChartDirective],
  templateUrl: './board-analytics.component.html',
  styleUrls: ['./board-analytics.component.scss'],
})
export class BoardAnalyticsComponent implements OnInit {
  @Input() companyId!: string;
  @Input() boardId!: string;

  chartOptions: ChartConfiguration['options'] = {
    responsive: true,
    plugins: { legend: { display: true } },
    scales: { x: {}, y: { beginAtZero: true } },
  };

  velocityData: ChartData<'bar'> = { labels: [], datasets: [] };
  burndownData: ChartData<'line'> = { labels: [], datasets: [] };
  cfdData: ChartData<'bar'> = { labels: [], datasets: [] };

  loading = true;
  error = '';

  constructor(private boardService: BoardService) {}

  ngOnInit() {
    this.loading = true;
    this.boardService
      .getBoardAnalytics(this.companyId, this.boardId)
      .subscribe({
        next: (analytics: BoardAnalyticsDto) => {
          this.velocityData = convertVelocityToChartData(analytics.velocity);
          this.burndownData = convertBurnDownToChartData(analytics.burndown);
          this.cfdData = convertCFDToChartData(analytics.cfd);
          this.loading = false;
        },
        error: () => {
          this.error = 'Ошибка загрузки аналитики';
          this.loading = false;
        },
      });
  }
}

function convertVelocityToChartData(
  velocity: VelocityPoint[]
): ChartData<'bar'> {
  return {
    labels: velocity.map((v) => v.sprintName),
    datasets: [
      {
        label: 'Завершено SP',
        data: velocity.map((v) => v.completedStoryPoints),
        backgroundColor: '#1976d2',
      },
    ],
  };
}

function convertBurnDownToChartData(
  burndown: BurnDownPoint[] | undefined
): ChartData<'line'> {
  const safeData = burndown ?? [];
  return {
    labels: safeData.map((b) => formatDate(b.date)),
    datasets: [
      {
        label: 'Оставшиеся задачи',
        data: safeData.map((b) => b.remainingTasks),
        borderColor: '#1976d2',
        backgroundColor: 'rgba(25, 118, 210, 0.07)',
        fill: false,
        tension: 0.3,
      },
      {
        label: 'Идеальный спуск',
        data: safeData.map((b) => b.idealTasks),
        borderDash: [5, 5],
        borderColor: '#aaa',
        fill: false,
        tension: 0.3,
      },
    ],
  };
}

function convertCFDToChartData(cfd: CfdPoint[]): ChartData<'bar'> {
  const labels = cfd.map((p) => formatDate(p.date));
  const columnNames = Object.keys(cfd[0]?.columnTaskCounts ?? {});
  return {
    labels,
    datasets: columnNames.map((colName, idx) => ({
      label: colName,
      data: cfd.map((point) => point.columnTaskCounts[colName] ?? 0),
      backgroundColor: getColor(idx),
      stack: 'stack-0',
    })),
  };
}

function formatDate(date: string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit' });
}

function getColor(idx: number): string {
  const colors = [
    '#1976d2',
    '#00bcd4',
    '#4caf50',
    '#ff9800',
    '#e91e63',
    '#9c27b0',
    '#795548',
  ];
  return colors[idx % colors.length];
}
