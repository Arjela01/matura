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
  isFall: boolean;
}

export interface ExamSiteTableView {
  data: ExamSite[];
  total: number;
}
