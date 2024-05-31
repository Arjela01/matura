import { ExamQuestionModel } from '../exam-question/exam-question.model';

export interface ExamQuestionScoreModel {
  id?: number;
  examQuestionID?: number;
  examScoreID?: string;
  examQuestionScore?: number;
  examSubjectID?: string;
  index?: number;
  score?: number;
  barcode?: string;
  maximumScore?: number;
  hasScore?: boolean;
  testNumber?: number;
}

export interface ExamQuestionsScoreDataEntry {
  examQuestion: ExamQuestionModel;
  examQuestionScore: ExamQuestionScoreModel;
}

export interface SearchOptions {
  examTypeId: string;
  examTypeName: string;
  examSubjectId: string;
  examSubjectName: string;
  examVariantId: string;
  examVariantName: string;
  barcode: string;
  testNumber: string;
}

export interface CreateOrUpdateMultiple {
  academicYearId: number;
  examQuestionScoreCreateUpdateModels: ExamQuestionScoreModel[];
  barcode: string;
  examVariantId: string;
}
