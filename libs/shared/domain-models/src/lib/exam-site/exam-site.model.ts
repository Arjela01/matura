export interface ExamSite{
  id: number;
  name: string;
  address: string;
  quota: number;
  administrationOfficeId: number;
  administrationOfficeName:string;
}

export interface ExamSiteTableView {
  data: ExamSite[];
  total: number;
}
