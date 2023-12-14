export interface ExamGradeRequestModel {
  id: string;
  idCard: string;
  examGradesRequestStatus: number;
  examGradesRequestStatusName: string;
  firstName: string;
  middleName: string;
  lastName: string;
  dateOfBirth: string;
  academicYearId: number;
  description: string;
}

export interface ExamGradeRequestView {
  data: ExamGradeRequestModel[];
  total: number;
}
export enum ExamGradeRequestStatus {
  New = 1,
  Refused,
  Approved,
  Pending,
}
