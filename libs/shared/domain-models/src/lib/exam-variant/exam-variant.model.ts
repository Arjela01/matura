export interface ExamVariant {
  id: string;
  name: string;
  numberOfQuestions: number;
  profileGroupId?: string;
  profileGroupName?: string;
  variant: string;
  examTypeId?: string;
  examTypeName?: string;
  examSubjectId?: string;
  examSubjectName?: string;
  code: string;
}
export interface ExamVariantTableView {
  data: ExamVariant[];
  total: number;
}
