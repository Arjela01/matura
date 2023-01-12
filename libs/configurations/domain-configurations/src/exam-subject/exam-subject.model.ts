export interface ExamSubject {
  id: string;
  name: string;
  code: string,
  examTypeId?: number;
  examTypeName?: string;
  academicYearId?: number;
  academicYearName?: string;
  credits: number;
  isOptional: boolean;
}

export interface ExamSubjectTableView {
  data: ExamSubject[];
  total: number;
}
