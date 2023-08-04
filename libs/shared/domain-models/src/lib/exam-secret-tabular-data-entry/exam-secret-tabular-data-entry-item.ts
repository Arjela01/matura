import { ExamSecret } from '../exam-secret/exam-secret.model';
import { ExamAssignment } from '../exam-assignment/exam-assignment.model';

export interface ExamSecretTabularDataEntryItem {
  examAssignment: ExamAssignment;
  examSecret: ExamSecret;
}
