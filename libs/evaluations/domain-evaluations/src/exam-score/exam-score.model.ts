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
  writingScore: number;
  multipleChoiceScore: number;
  modificationReason: string;
  documentName: string;
}

export interface ExamScoreTableView {
  data: ExamScore[];
  total: number;
}

export interface FileImport {
  file: string | ArrayBuffer | null;
}
