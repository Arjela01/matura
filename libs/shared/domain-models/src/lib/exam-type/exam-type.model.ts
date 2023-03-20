export interface ExamType {
  id: string;
  name: string;
  maximumValueWritingScore: number;
  maximumValueMultipleScore: number;

}

export interface ExamTypeTableView {
  data: ExamType[];
  total: number;
}
