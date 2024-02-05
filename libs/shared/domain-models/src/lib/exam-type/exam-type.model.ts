export interface ExamType {
  id: number;
  name: string;
  maximumValueWritingScore: number;
  maximumValueMultipleScore: number;
  isFall: boolean;
  dependsOnSchoolProfile: boolean;
  isOptional: boolean;
}

export interface ExamTypeTableView {
  data: ExamType[];
  total: number;
}
