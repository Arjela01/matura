export interface ExamSubject {
  id: number;
  name: string;

}

export interface ExamSubjectTableView {
  data: ExamSubject[];
  total: number;
}
