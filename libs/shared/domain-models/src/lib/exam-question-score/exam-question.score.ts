import { ExamQuestionModel } from '../exam-question/exam-question.model';

export interface ExamQuestionScore {
  id?: number;
  examQuestionScoreTotalId?: number;
  score?: number;
  examQuestionId?: number;
  examQuestionIndex?: number;
  examQuestionSection?: string;
  examQuestionMaximumScore?: number;
  testNumber?: string;
  barcode?: string;
  totalScore?: number;
  examTypeId?: number;
  examTypeName?: string;
  examSubjectId?: string; // Using string as a placeholder for Guid
  examSubjectName?: string;
  examVariantId?: number;
  examVariantName?: string;
  academicYearIsActive?: boolean;
  academicYearName?: string;
  academicYearId?: number;
}

export interface ExamQuestionsScoreDataEntry {
  examQuestion: ExamQuestionModel;
  examQuestionScore: ExamQuestionScore;
}

export interface ExamQuestionScoreCreateUpdateMultipleCommand {
  examQuestionScoreTotalId?: number;
  examQuestionScoreCreateUpdateModels: ExamQuestionScoreCreateUpdateModel[];
  barcode: string;
  testNumber: string;
  examVariantId?: number;
}

export interface ExamQuestionScoreCreateUpdateModel {
  examQuestionId: number;
  score?: number;
}
