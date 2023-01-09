export interface ExamSubject {
  id: number;
  name: string;
  code: string,
  examTypeId?: number;
  academicYearId?: number;
  credits: number;
  isOptional: boolean;
}

export interface ExamSubjectTableView {
  data: ExamSubject[];
  total: number;
}
