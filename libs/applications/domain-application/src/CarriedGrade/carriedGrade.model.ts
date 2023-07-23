export interface CarriedGrade {
  id: number;
  academicYearId?: number;
  academicYearName?: string;
  studentId?: string;
  studentFullName?: string;
  examSubjectId?: string;
  examSubjectName?: string;
  nid?: string;
  examTypeId?: number;
  examTypeName?: string;
  year: number;
  grade: number;
  document?: string;
}

export interface CarriedGradeTable {
  data: CarriedGrade[];
  total: number;
}
