export interface ExamSecret {
  id?: string;
  studentId?: string;
  studentName?: string;
  examSubjectId?: string;
  examSubjectName?: string;
  examTypeId?: number;
  examTypeName?: string;
  examSiteId?: string;
  examSiteName?: string;
  barcode?: string;
  isFall?: boolean;
  studentInputData?: string;
  academicYearId?: number;
  studentIdentifier?: string;
  hasBarcode?: boolean;
  examSecretNoteId?: any;
  examSecretNoteName?: string;
  administrationOfficeId?: number;
  administrationOfficeName?: string;
  examDateId?: string;
  examDate?: string;
}

export interface ExamSecretTableView {
  data: ExamSecret[];
  total: number;
}
