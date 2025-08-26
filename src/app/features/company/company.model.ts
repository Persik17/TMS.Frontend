export interface CompanyViewModel {
  id: string;
  name: string;
  inn: string;
  ogrn: string;
  address: string;
  logo: string;
  website: string;
  industry: string;
  description: string;
  contactEmail: string;
  contactPhone: string;
  isActive: boolean;

  ceoSummary: {
    boards: {
      name: string;
      tasksTotal: number;
      tasksDone: number;
      tasksInProgress: number;
    }[];
    totalTasks: number;
    totalDone: number;
    totalInProgress: number;
    leadBoard: string;
    mostActiveUser: string;
  };

  tariffSummary: {
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
    renewalDate: string;
    pricePerPeriod: number;
    currency: string;
    features: string[];
  };
}
