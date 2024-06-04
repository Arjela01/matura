import { ExamSubject } from '../exam-subject/exam-subject.model';

export interface ExamSubjectGroup {
  id: string;
  name: string;
  examSubjects?: ExamSubject[];
  examSubjectIds?: string[];
}

export interface ExamSubjectGroupView {
  data: ExamSubjectGroup[];
  total: number;
}
