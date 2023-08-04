export interface ExamSecretSearchModel {
  examDateId: number;
  administrationOfficeId?: number;
  examSiteId: string;
  examTypeId?: number;
  examSubjectId: string;
  hasBarcode?: number;
  isFall?: number;
  subjectName?: string;
}
