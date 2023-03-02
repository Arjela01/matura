export interface ExamSite{
  id: number;
  name: string;
  address: string;
  quota: number;
  administrationOfficeId: number;
  administrationOfficeName:string;
  academicYearId?: number,

}

export interface ExamSiteTableView {
  data: ExamSite[];
  total: number;
}
