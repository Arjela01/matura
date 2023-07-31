import { ExamAssignment } from '@msh/shared/domain-models';
import { ExamSecret } from '../exam-secret/exam-secret.model';

export interface ExamSecretTabularDataEntryItem {
  examAssignment: ExamAssignment;
  examSecret: ExamSecret;
}
