export interface ExamSubject {
  id: string;
  name: string;
  code: string,
  examTypeId?: number;
  examTypeName?: number;
  academicYearId?: number;
  academicYearName?: number;
  credits: number;
  isOptional: boolean;
}

export interface ExamSubjectTableView {
  data: ExamSubject[];
  total: number;
}
