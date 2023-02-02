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
  subjectD1A1ZId?: string;
  subjectD2A1ZId?: string;
  subjectD3A1ZId?: string;
  subjectZ1A1ZId?: string;
  scoreD1A1Z?: number;
  scoreD2A1Z?: number;
  scoreD3A1Z?: number;
  scoreZ1A1Z?: number;
  scoreZ2A1Z?: number;
  subjectZ21A1ZId?: string;
  carriedGradeD3?: number;
  carriedReasonD3?: string;
  noCarriedSubjetsZ?: number;
  yearZ1?: number;
  isA1?: boolean;
  carriedSubjectZ1?: string;
  carriedGradeZ1?: number;
  carriedReasonAZ1?: string;
  // subjectD1Id?: string;
  // subjectD2Id?: string;
  // subjectD3Id?: string;
  // subjectZ1Id?: string;
  overSeerCode?: string;
  isApplyingToForeignCountries?: boolean;
}

export interface A1ZTableView {
  data: A1Z[];
  total: number;
}
