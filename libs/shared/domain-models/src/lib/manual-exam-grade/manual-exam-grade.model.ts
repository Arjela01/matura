export interface ManualExamGradeModel {
  id: string;
  examSubjectId: string;
  examSubjectName: string;
  grade: number;
  isManualEntry: boolean;
}

export interface ManualExamGradeView {
  data: ManualExamGradeModel[];
  total: number;
}
