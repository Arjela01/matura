export interface ExamSubjectGroup {
  id: string;
  name: string;
  externalName: string;
  code: string;
  examTypeId?: number;
  examSubjectIds?: string[];
  examSubjectNames?: string[];
  examTypeName?: string;
  academicYearId?: number;
  academicYear?: string;
  credits: number;
  isOptional: boolean;
  isNotGraded: boolean;
}

export interface ExamSubjectGroupView {
  data: ExamSubjectGroup[];
  total: number;
}
