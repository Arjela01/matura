export interface ExamGrade {
  id?: number;
  studentId?: string;
  studentName?: string;
  examSubjectId?: string;
  examSubjectName?: string;
  isCarriedOver?: boolean;
  grade?: number;
  isFall?: boolean;
}

export interface ExamGradeTableView {
  data: ExamGrade[];
  total: number;
}
