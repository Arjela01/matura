export interface ExamQuestionScoreTotal {
  id?: number;
  testNumber?: string;
  barcode?: string;
  examTypeId?: number;
  examTypeName?: string;
  examSubjectId?: string;
  examSubjectName?: string;
  examVariantId?: number;
  examVariantName?: string;
  academicYearIsActive?: boolean;
  academicYearName?: string;
  academicYearId?: number;
  totalScore?: number;
}

export interface ExamQuestionScoreTotalView {
  data: ExamQuestionScoreTotal[];
  total: number;
}
