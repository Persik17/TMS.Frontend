interface CeoSummary {
  boards: BoardSummary[];
  totalTasks: number;
  totalDone: number;
  totalInProgress: number;
  leadBoard?: string;
  mostActiveUser?: string;
}
