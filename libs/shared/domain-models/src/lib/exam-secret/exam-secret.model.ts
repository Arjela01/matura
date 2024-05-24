export interface ExamSecret {
  id?: string;
  studentId?: string;
  studentName?: string;
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
  examSiteId?: string;
  examSiteName?: string;
  examTypeId?: number;
  examTypeName?: string;
  examDateId?: number;
  examDate?: string;
  examSubjectId?: string;
  examSubjectName?: string;
  examAssignmentId?: string;
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
