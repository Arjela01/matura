export interface TotalScoresWithoutAnalyticModel {
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
  totalScore: number;
}

export interface TotalScoresWithoutAnalyticModelView {
  data: TotalScoresWithoutAnalyticModel[];
  total: number;
}
