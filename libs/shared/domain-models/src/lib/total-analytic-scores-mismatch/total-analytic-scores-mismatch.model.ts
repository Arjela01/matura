export interface TotalAnalyticScoresMismatchModel {
  id: number;
  analyticScoresBarcode: string;
  analyticScoresExamTypeId: number;
  analyticScoresExamTypeName: string;
  analyticScoresExamSubjectId: number;
  analyticScoresExamSubjectName: string;
  analyticScore: number;
  totalScoresBarcode: string;
  totalScoresExamTypeId: number;
  totalScoresExamTypeName: string;
  totalScoresExamSubjectId: number;
  totalScoresExamSubjectName: string;
  totalScore: number;
  academicYearId: number;
  academicYearIsActive: boolean;
  isDeleted: boolean;
}
export interface TotalAnalyticScoresMismatchModelView {
  data: TotalAnalyticScoresMismatchModel[];
  total: number;
}
