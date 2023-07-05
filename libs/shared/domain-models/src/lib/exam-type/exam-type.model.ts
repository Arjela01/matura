export interface ExamType {
  id: string;
  name: string;
  maximumValueWritingScore: number;
  maximumValueMultipleScore: number;
  isFall: boolean;
  additionalValue?:boolean;

}

export interface ExamTypeTableView {
  data: ExamType[];
  total: number;
}
