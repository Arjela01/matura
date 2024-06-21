export interface EAlbaniaMessageStatistics {
  errorCount?: number;
  waitingCount?: number;
  successCount?: number;
  needApprovalCount?: number;
}

export interface DiplomaMessageStatistic extends EAlbaniaMessageStatistics {}
