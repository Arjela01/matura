export interface ExamType {
  id: number;
  name: string;
}

export interface ExamTypeTableView {
  data: ExamType[];
  total: number;
}
