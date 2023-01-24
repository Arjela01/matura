export interface A1Z {
  id?: number;
  academicYearId?: number;
  studentId?: string;
  a1ZCategoryId?: string;
  alreadyHaveDiploma?: boolean;
  yearOfSchoolA1Z?: number;
  noCarriedSubjets?: number;
  studentInputData?: string;
  carriedSubjectD1?: string;
  carriedGradeD1?: number;
  carriedReasonD1?: string;
  carriedSubjectD2?: string;
  carriedGradeD2?: number;
  carriedReasonD2?: string;
  carriedSubjectD3?: string;
  carriedGradeD3?: number;
  carriedReasonD3?: string;
  noCarriedSubjetsZ?: number;
  yearZ1?: number;
  isA1?: boolean;
  carriedSubjectAZ1?: string;
  carriedGradeAZ1?: number;
  carriedReasonAZ1?: string;
  subjectD1?: string;
  subjectD2?: string;
  subjectD3?: string;
  subjectZ1?: string;
  overSeerCode?: string;
  isApplyingToForeignCountries?: boolean;
}

export interface A1ZTableView {
  data: A1Z[];
  total: number;
}
