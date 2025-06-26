import { ChartData, ChartConfiguration } from 'chart.js';

export type ChartType = 'bar' | 'line' | 'pie' | 'doughnut' | 'radar';

export interface BoardChartConfig<TType extends ChartType = ChartType> {
  title: string;
  type: TType;
  data: ChartData<TType>;
  options?: ChartConfiguration<TType>['options'];
}
