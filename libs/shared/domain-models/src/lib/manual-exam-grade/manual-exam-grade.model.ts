export interface ManualExamGradeModel {
  id: string;
  examSubjectId: string;
  examSubjectName: string;
  manualExamGrade: number;
}

export interface ManualExamGradeView {
  data: ManualExamGradeModel[];
  total: number;
}
