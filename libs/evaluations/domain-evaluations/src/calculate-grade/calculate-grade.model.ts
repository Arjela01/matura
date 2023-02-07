export interface CalculateGrade {
  appProcessType: string;
  processStatus: string;
  startTime: Date;
  endTime: Date;
  errorMessage: string;
  executionLog: string;
  executionTime: string
}

export interface CalculateGradeTableView {
  data: CalculateGrade;
}

