export interface ExamSecret {
  id: string,
  studentId?: string,
  studentName: string,
  examVersionId?: string,
  examVersionName: string,
  academicYearId: number,
  academicYear: string,
  barcode: string,
  isFall: boolean
}

export interface ExamSecretTableView {
  data: ExamSecret[];
  total: number;
}
