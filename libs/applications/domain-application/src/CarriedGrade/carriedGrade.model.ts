export interface CarriedGrade {
  id: number;
  academicYearId?: number;
  studentId?: string;
  examSubjectId?: string;
  nid: string;
  examTypeID: number;
  examTypeName: string;
  examSubject: string;
  year: number;
  grade: number;
  document: string;
}

export interface CarriedGradeTable {
  data: CarriedGrade[];
  total: number;
}
