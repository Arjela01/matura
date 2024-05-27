export interface ExamGradeChange {
  id?: number;
  examGradeTypeId?: number;
  examGradeChangeTypeId?: number;
  examGradeTypeName?: string;
  studentId?: string;
  studentStudentId?: string;
  studentFirstName?: string;
  studentLastName?: string;
  examGradeID?: string;
  isScoreChanged?: boolean;
  previousScore?: number;
  newScore?: number;
  isGradeChanged?: boolean;
  previousGrade?: number;
  newGrade?: number;
  isExamSubjectChanged?: boolean;
  previousExamSubjectId?: string;
  previousExamSubjectName?: string;
  newExamSubjectId?: string;
  newExamSubjectName?: string;
  comments?: string;
  academicYearID?: number;
  academicYearName?: string;
  academicYearIsActive?: boolean;
}

export interface ExamGradeChangeView {
  data: ExamGradeChange[];
  total: number;
}
