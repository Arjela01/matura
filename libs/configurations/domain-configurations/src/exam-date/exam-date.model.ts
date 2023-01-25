export interface ExamDate{
  id: string;
  date: Date;
  time: string;
  examSiteId: number;
  examSiteName:string;
  examTypeId: number;
  examTypeName?: string;
}

export interface ExamDateTableView {
  data: ExamDate[];
  total: number;
}
