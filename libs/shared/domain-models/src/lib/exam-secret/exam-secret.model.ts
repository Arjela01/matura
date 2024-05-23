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
  examDate?: string;
}

export interface ExamSecretTableView {
  data: ExamSecret[];
  total: number;
}

export interface ExamSecretLock {
  id?: number;
  examTypeId?: number;
  examTypeName?: string;
  isSecretDataEntryCompleted?: boolean;
  isFall?: boolean;
  academicYearId?: number;
}
export interface ExamSecretLockView {
  data: ExamSecretLock[];
}
