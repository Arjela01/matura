export interface ExamVersion {
  id: number;
  name: string;
  numberOfQuestions: number;
  profileGroupId?: string;
  variant: string;
  examTypeId?: string;
}
export interface ExamVersionTableView {
  data: ExamVersion[];
  total: number;
}
