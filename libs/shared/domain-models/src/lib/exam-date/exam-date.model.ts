export interface ExamDate{
  id: string;
  date: any;
  time: string;
  examSiteIds: number;
  examSiteId: number;
  examSiteName:string;
  examTypeId: number;
  examTypeName?: string;
}

export interface ExamDateTableView {
  data: ExamDate[];
  total: number;
}
