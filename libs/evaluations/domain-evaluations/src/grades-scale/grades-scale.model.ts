export interface GradesScale {
  id?: number;
  examSubjectId: string;
  examSubjectName?: string;
  examTypeName?: string;
  score: number;
  grade: number;
}

export interface GradesScaleTableView {
  data: GradesScale[];
  total: number;
}
