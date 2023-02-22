export interface A1Z {
  id?: number;
  academicYearId?: number;
  studentId?: string;
  a1ZCategoryId?: string;
  alreadyHaveDiploma?: boolean;
  yearOfSchoolA1Z?: number;

  subjectD1Id?: string;
  subjectD1Name?: string;
  scoreD1?: number;
  reasonD1?: string;
  yearD1?: number;

  subjectD2Id?: string;
  subjectD2Name?: string;
  scoreD2?: number;
  reasonD2?: string;
  yearD2?: number;

  subjectD3Id?: string;
  subjectD3Name?: string;
  scoreD3?: number;
  reasonD3?: string;
  yearD3?: number;

  subjectZ1Id?: string;
  subjectZ1Name?: string;
  scoreZ1?: number;
  reasonZ1?: string;
  yearZ1?: number;

  subjectZ2Id?: string;
  subjectZ2Name?: string;
  scoreZ2?: number;
  reasonZ2?: string;
  yearZ2?: number;

  isA1?: boolean;
  highSchoolGraduationYear?: boolean;
  overSeerCode?: string;
  isApplyingToForeignCountries?: boolean;
  studentInputData?: string;
}

export interface A1ZTableView {
  data: A1Z[];
  total: number;
}
