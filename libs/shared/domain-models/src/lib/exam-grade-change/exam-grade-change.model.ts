export interface ExamGradeChange {
  id?: number;
  examGradeChangeTypeId?: number;
  examGradeID?: string;
  isScoreChanged?: boolean;
  newScore?: number;
  isExamSubjectChanged?: boolean;
  newExamSubjectId?: string;
  comments?: string;
}
