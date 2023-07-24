export interface ExamDate {
  id: string;
  date: any;
  time: string;
  examSiteIds: number;
  examSiteId: number;
  examSiteName: string;
  examTypeId: number;
  examTypeName?: string;
  isFall?: boolean;
}

export interface ExamDateTableView {
  data: ExamDate[];
  total: number;
}
