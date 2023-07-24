export interface ExamSite {
  id: any;
  name: string;
  address: string;
  quota: number;
  administrationOfficeId: number;
  administrationOfficeName: string;
  academicYearId?: number;
  highschoolIds?: any;
  highschoolsNames?: string[];
  highSchools?: any;
}

export interface ExamSiteTableView {
  data: ExamSite[];
  total: number;
}
