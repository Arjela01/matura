export interface ExamGrade {
  id?: number;
  studentId?: string;
  studentName?: string;
  examSubjectId?: string;
  examSubjectName?: string;
  examTypeId?: number;
  examTypeName?: string;
  academicYearId?: number;
  academicYearName?: string;
  isCarriedOver?: boolean;
  grade?: number;
  isFall?: boolean;
}

export interface ExamGradeTableView {
  data: ExamGrade[];
  total: number;
}
