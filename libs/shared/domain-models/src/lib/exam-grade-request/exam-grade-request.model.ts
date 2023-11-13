export interface ExamGradeRequestModel  {
  id: string;
  firstName : string;
  middleName: string;
  lastName : string;
  dateOfBirth : string;
  academicYearId : number;
}

export interface  ExamGradeRequestView {
  data : ExamGradeRequestModel[];
  total : number;
}
