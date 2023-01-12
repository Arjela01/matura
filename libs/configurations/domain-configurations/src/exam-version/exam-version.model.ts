export interface ExamVersion {
  id: number;
  name: string;
  numberOfQuestions: number;
  profileGroupId?: string;
  profileGroupName?:string;
  variant: string;
  examTypeId?: string;
  examTypeName?: string;
}
export interface ExamVersionTableView {
  data: ExamVersion[];
  total: number;
}
