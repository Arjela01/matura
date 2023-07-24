export interface ExamScore {
  id: number;
  examSecretId?: string;
  studentId?: string;
  studentName?: string;
  examTypeId?: number;
  examTypeName?: string;
  examSubjectId?: string;
  examSubjectName?: string;
  academicYearId?: number;
  barcode: string;
  writingScore: number;
  multipleChoiceScore: number;
  modificationReason: string;
  documentName: string;
  maximumValueMultipleScore: number;
  maximumValueWritingScore: number;
  archiveFolderNr?: number;
  archiveFolderIndex?: number;
  isFall: boolean;
}

export interface ExamScoreTableView {
  data: ExamScore[];
  total: number;
}

export interface FileImport {
  file: string | ArrayBuffer | null;
}
