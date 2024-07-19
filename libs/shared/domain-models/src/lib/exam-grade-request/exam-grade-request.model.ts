export interface ExamGradeRequestModel {
  id: string;
  idCard: string;
  maturaId: string;
  examGradesRequestStatusId: number;
  examGradesRequestStatusName: string;
  firstName: string;
  middleName: string;
  lastName: string;
  dateOfBirth: string;
  academicYearId: number;
  description: string;
  email: string;
  highSchoolId: string;
  attachedDocument?: string;
  documentName?: any;
  comments?: string;
  isQueued: boolean;
  queueDate?: string;
  dequeueDate?: string;
  isQueueReady: boolean;
  eAlbaniaDocumentResponse?: string;
}

export interface ExamGradeRequestView {
  data: ExamGradeRequestModel[];
  total: number;
}

export interface ExamGradesRequestStatus {
  id: number;
  name: string;
  description: string;
}