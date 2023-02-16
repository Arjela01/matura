export interface ApplicationProcess {
  id: number;
  appProcessType: string;
  processStatus: string;
  startTime: Date;
  endTime: Date;
  errorMessage: string;
  executionLog: string;
  executionTime: string;
}

export interface ApplicationProcessTableView {
  data: ApplicationProcess;
}

export interface Process {
  data: ApplicationProcess;

}
