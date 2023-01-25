export interface ExamScore {
  id: number;
  examSecretId?: string;

  examTypeId?: number;
  examTypeName?: string;

  examSubjectId?: string;
  examSubjectName?: string;

  examVersionId: string;
  examVersionName: string;

  barcode: string;
  academicYearId: number;
  academicYear: string;
  writingScore: number;
  multipleChoiceScore: number;
  modificationReason: string;
  documentName: string;
}

export interface ExamScoreTableView {
  data: ExamScore[];
  total: number;
}
