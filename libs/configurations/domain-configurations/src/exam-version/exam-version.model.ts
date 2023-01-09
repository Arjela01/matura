export interface ExamVersion {
  id: number;
  name: string;
  // numberOfQuestions: number;
  // profileGroup: string;
  // variant: string;
  // examType: string;
}
export interface ExamVersionTableView {
  data: ExamVersion[];
  total: number;
}
