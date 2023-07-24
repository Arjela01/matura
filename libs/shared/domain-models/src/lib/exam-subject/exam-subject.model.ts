export interface ExamSubject {
  id: string;
  name: string;
  code: string;
  examTypeId?: number;
  examTypeName?: string;
  academicYearId?: number;
  academicYear?: string;
  credits: number;
  isOptional: boolean;
  isNotGraded: boolean;
}

export interface ExamSubjectTableView {
  data: ExamSubject[];
  total: number;
}
