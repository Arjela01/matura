export interface ExamScore {
  id: number;
  examSecretId?: string;
  totalScore?: number;
  studentId?: string;
  studentStudentId?: string;
  studentFirstName?: string;
  studentMiddleName?: string;
  studentLastName?: string;
  studentNid?: string;
  examTypeId?: number;
  examTypeName?: string;
  examSubjectId?: string;
  examSubjectName?: string;
  academicYearId?: number;
  academicYear?: string;
  barcode?: string;
  modificationReason?: string;
  documentName?: string;
  maximumValueMultipleScore?: number;
  maximumValueWritingScore?: number;
  archiveFolderNr?: number;
  archiveExamIndex?: number;
  isFall?: boolean;
  hasWritingScore?: boolean;
}

export interface ExamScoreTableView {
  data: ExamScore[];
  total: number;
}
