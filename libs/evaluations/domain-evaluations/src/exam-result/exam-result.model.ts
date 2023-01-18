export interface ExamResult {
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

export interface ExamResultTableView {
  data: ExamResult[];
  total: number;
}
