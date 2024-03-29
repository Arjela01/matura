export interface ExamQuestionModel {
  id: number;
  index: number;
  questionMaximumScore: number;
  examVariantID: number;
  examVariantName: string;
  examVariantAcademicYear: string;
  examVariantExamSubjectName: string;
  examVariantProfileGroupName: string;
  examVariantProfileName: string;
  examVariantMaximumScore: number;
  section: string;
}

export interface ExamQuestionTableView {
  data: ExamQuestionModel[];
  total: number;
}
