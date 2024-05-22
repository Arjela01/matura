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
  examSecretNoteId?: any;
  examSecretNoteName?: string;
  administrationOfficeId?: string;
  administrationOfficeName?: string;
  examDateId?: string;
  examDateName?: string;
}

export interface ExamSecretTableView {
  data: ExamSecret[];
  total: number;
}
