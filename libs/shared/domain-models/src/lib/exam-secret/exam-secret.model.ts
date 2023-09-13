export interface ExamSecret {
  id?: string;
  studentId?: string;
  studentName?: string;
  examSubjectId?: string;
  examSubjectName?: string;
  examTypeId?: string;
  examTypeName?: string;
  examSiteId?: string;
  examSiteName?: string;
  barcode?: string;
  isFall?: boolean;
  studentInputData?: string;
  academicYearId?: number;
  studentIdentifier?: string;
  hasBarcode?: boolean;
  examSecretNoteId?: number;
  examSecretNoteName?: string;
}

export interface ExamSecretTableView {
  data: ExamSecret[];
  total: number;
}
