import { ExamSubject } from '../exam-subject/exam-subject.model';

export interface ExamSubjectGroup {
  id: string;
  name: string;
  examSubjects?: ExamSubject[];
}

export interface ExamSubjectGroupView {
  data: ExamSubjectGroup[];
  total: number;
}
