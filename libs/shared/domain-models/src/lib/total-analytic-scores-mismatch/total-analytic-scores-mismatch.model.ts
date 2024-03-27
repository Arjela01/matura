export interface TotalAnalyticScoresMismatchModel {
  id: number;
  analyticPointsBarcode: string;
  analyticPointsExamTypeId: number;
  analyticPointsExamTypeName: string;
  analyticPointsExamSubjectId: number;
  analyticPointsExamSubjectName: string;
  analyticScore: number;
  totalPointsBarcode: string;
  totalPointsExamTypeId: number;
  totalPointsExamTypeName: string;
  totalPointsExamSubjectId: number;
  totalPointsExamSubjectName: string;
  totalScore: number;
  academicYearId: number;
  academicYearIsActive: boolean;
  isDeleted: boolean;
}
export interface TotalAnalyticScoresMismatchModelView {
  data: TotalAnalyticScoresMismatchModel[];
  total: number;
}
