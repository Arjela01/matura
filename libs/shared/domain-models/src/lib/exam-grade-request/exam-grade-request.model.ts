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
}

export interface ExamGradeRequestView {
  data: ExamGradeRequestModel[];
  total: number;
}
