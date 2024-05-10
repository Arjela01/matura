export interface ExamGrade {
  id?: number;
  studentId?: string;
  studentStudentId?: string;
  studentName?: string;
  examSubjectId?: string;
  examSubjectName?: string;
  examTypeId?: number;
  examTypeName?: string;
  academicYearId?: number;
  academicYearName?: string;
  academicYearIsActive?: string;
  isCarriedOver?: boolean;
  grade?: number;
  isFall?: boolean;
  isCarriedGrade?: boolean;
}

export interface ExamGradeTableView {
  data: ExamGrade[];
  total: number;
}
