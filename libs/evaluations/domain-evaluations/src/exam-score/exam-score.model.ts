export interface ExamScore{
  id: number;
  studentId?: string;
  studentName: string;
  barcode: string;
  examSubjectCode: number;
  academicYearId?: number;
  academicYear: string;
  isFall: boolean;
  writingScore: number;
  multipleChoiceScore: number;
  modificationReason: string;
  documentName: string;
}

export interface ExamScoreTableView {
  data: ExamScore[];
  total: number;
}
