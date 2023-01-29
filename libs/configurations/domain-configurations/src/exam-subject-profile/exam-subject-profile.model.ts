export interface ExamSubjectProfile {
  id: string;
  name: string;
  code: string,
  examTypeId?: number;
  examTypeName?: string;
  academicYearId?: number;
  academicYear?: string;
  credits: number;
  isOptional: boolean;
  profileId?: number;
  profileName?: string;
  examSubjectId: any;
  examSubjectName: any;
}

export interface ExamSubjectProfileTableView {
  data: ExamSubjectProfile[];
  total: number;
}
