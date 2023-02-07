export interface GenerateGrade {
  appProcessType: string;
  processStatus: string;
  startTime: Date;
  endTime: Date;
  errorMessage: string;
  executionLog: string;
  executionTime: string
}

export interface GenerateGradeTableView {
  data: GenerateGrade;
}

