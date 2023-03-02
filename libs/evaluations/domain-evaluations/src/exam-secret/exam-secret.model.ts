export interface ExamSecret {
  id: string;
  studentId?: string;
  studentName: string;
  examSubjectId?: string;
  examSubjectName: string;
  barcode: string;
  isFall: boolean;
  studentInputData?: string;
}

export interface ExamSecretTableView {
  data: ExamSecret[];
  total: number;
}
