export interface ExamDate{
  id: string;
  dateTime: any;
  examSiteId: number;
  examSiteName:string;
  examTypeId: number;
  examTypeName?: string;
}

export interface ExamDateTableView {
  data: ExamDate[];
  total: number;
}
