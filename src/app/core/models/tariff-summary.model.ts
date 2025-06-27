interface TariffSummary {
  planName: string;
  isTrial: boolean;
  status: 'active' | 'expired' | 'pending';
  period: string;
  usersLimit: number;
  boardsLimit: number;
  tasksLimit: number;
  currentUsers: number;
  currentBoards: number;
  currentTasks: number;
  autoRenew: boolean;
  renewalDate?: string;
  pricePerPeriod: number;
  currency: string;
  features: string[];
}
