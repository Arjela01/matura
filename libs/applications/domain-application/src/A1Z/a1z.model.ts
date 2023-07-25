export interface A1Z {
  id?: number;

  studentStudentId?: string;
  studentFirstName?: string;
  studentMiddleName?: string;
  studentLastName?: string;
  studentBirthDate?: string;
  studentBirthPlace?: string;
  studentIdentifier?: string;
  studentOldIdentifier?: string;
  studentNid?: string;
  studentId?: string;

  subjectD1Id?: string;
  subjectD1Name?: string;
  scoreD1?: number;
  reasonD1?: string;
  academicYearD1Id?: number;
  academicYearD1Name?: string;
  carryD1?: boolean;
  carriedGradeD1Id?: number;

  subjectD2Id?: string;
  subjectD2Name?: string;
  scoreD2?: number;
  reasonD2?: string;
  academicYearD2Id?: number;
  academicYearD2Name?: string;
  carryD2?: boolean;
  carriedGradeD2Id?: number;

  subjectD3Id?: string;
  subjectD3Name?: string;
  scoreD3?: number;
  reasonD3?: string;
  academicYearD3Id?: number;
  academicYearD3Name?: string;
  carryD3?: boolean;
  carriedGradeD3Id?: number;

  subjectZ1Id?: string;
  subjectZ1Name?: string;
  scoreZ1?: number;
  reasonZ1?: string;
  academicYearZ1Id?: number;
  academicYearZ1Name?: string;
  carryZ1?: boolean;
  carriedGradeZ1Id?: number;

  subjectZ2Id?: string;
  subjectZ2Name?: string;
  scoreZ2?: number;
  reasonZ2?: string;
  academicYearZ2Id?: number;
  academicYearZ2Name?: string;
  carryZ2?: boolean;
  carriedGradeZ2Id?: number;

  subjectZ3Id?: string;
  subjectZ3Name?: string;
  scoreZ3?: number;
  reasonZ3?: string;
  academicYearZ3Id?: number;
  academicYearZ3Name?: string;
  carryZ3?: boolean;
  carriedGradeZ3Id?: number;

  isApplyingToForeignCountries?: boolean;
  isA1?: boolean;
  alreadyHaveDiploma?: boolean;
  yearOfSchoolA1Z?: number;

  a1ZCategoryId?: string;
  a1ZCategoryName?: string;

  isEAlbaniaApplication?: boolean;

  academicYearId?: number;
  academicYearName?: string;

  overSeerCode?: string;
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
