export interface AnalyticScoresWithoutTotalModel {
  id: string;
  examTypeId: number;
  examTypeName: string;
  examSubjectId: string;
  examSubjectName: string;
  examVariantId: number;
  examVariantName: string;
  barcode: string;
  academicYearId: number;
  academicYearIsActive: true;
  analyticScore: number;
}

export interface AnalyticScoresWithoutTotalModelView {
  data: AnalyticScoresWithoutTotalModel[];
  total: number;
}
