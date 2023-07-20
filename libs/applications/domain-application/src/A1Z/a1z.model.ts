export interface A1Z {
  id?: number;
  a1ZCategoryId?: string;
  academicYearId?: number;
  studentId?: string;
  alreadyHaveDiploma?: boolean;
  isA1?: boolean;
  yearOfSchoolA1Z?: string;
  overSeerCode?: string;
  isApplyingToForeignCountries?: boolean;
  subjectD1Id?: string;
  subjectNameD1?: string;
  scoreD1?: number;
  reasonD1?: string;
  yearD1?: number;
  subjectD2Id?: string;
  subjectNameD2?: string;
  scoreD2?: number;
  reasonD2?: string;
  yearD2?: number;
  subjectD3Id?: string;
  subjectNameD3?: string;
  scoreD3?: number;
  reasonD3?: string;
  yearD3?: number;
  subjectZ1Id?: string;
  subjectNameZ1?: string;
  scoreZ1?: number;
  reasonZ1?: string;
  yearZ1?: number;
  subjectZ2Id?: string;
  subjectNameZ2?: string;
  scoreZ2?: number;
  reasonZ2?: string;
  yearZ2?: number;
  firstName?: string;
  middleName?: string;
  lastName?: string;
  studentBirthDate?: Date;
  studentBirthPlace?: string;
  studentIdentifier?: string;
  studentNid?: string;
}

// TODO: ADD STUDENT IDENTIFIER TO TABLE RECORD
export interface A1ZTableRecord {
  id?: number;
  academicYear?: number;
  academicYearActive?: boolean;
  firstName?: string;
  middleName?: string;
  lastName?: string;
  studentNid?: string;
  studentOldIdentifier?: string;
  birthDate?: Date;
  birthPlace?: string;
  isApplyingToForeignCountries?: boolean;
  isA1?: boolean;
  createdOn?: Date;
}

export interface A1ZTableView {
  data: A1ZTableRecord[];
  total: number;
}

export enum FormType {
  A1,
  A1Z,
}
