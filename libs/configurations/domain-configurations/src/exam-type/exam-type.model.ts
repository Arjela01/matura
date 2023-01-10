export interface ExamType {
  id: string;
  name: string;
}

export interface ExamTypeTableView {
  data: ExamType[];
  total: number;
}
